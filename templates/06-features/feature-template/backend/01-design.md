# Backend Design: *[Feature Name]*

**Parent Design:** [../design.md](../design.md)  
**Parent Requirements:** [../requirements.md](../requirements.md)  
**Tasks:** [./tasks.md](./tasks.md)  
**Test Plan:** [./test-plan.md](./test-plan.md)  

---

## Why

*Backend-specific design rationale and architectural decisions*

### System Design Goals
>
> **What are we optimizing for in the backend?**

1. **Reliability:** 99.9% uptime, graceful degradation
2. **Scalability:** Handle 10x current load without major refactoring
3. **Performance:** <100ms P95 response times for all endpoints
4. **Security:** Zero-trust architecture with comprehensive audit trails
5. **Maintainability:** Single team can own and operate the service

### Architectural Principles

- **Domain-Driven Design:** Clear bounded contexts and business logic separation
- **Hexagonal Architecture:** Ports and adapters pattern for testability
- **CQRS Pattern:** Separate read and write models for optimal performance
- **Event Sourcing:** Audit trail and eventual consistency support
- **Circuit Breaker:** Fail fast and protect downstream services

### Technology Choices

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| **Runtime** | Node.js 18+ | Team expertise, ecosystem | Single-threaded for CPU-intensive tasks |
| **Framework** | Express.js | Lightweight, middleware ecosystem | Less opinionated than alternatives |
| **Database** | PostgreSQL 15 | ACID compliance, JSON support | More complex than NoSQL for simple queries |
| **Cache** | Redis 7 | In-memory performance, pub/sub | Additional infrastructure complexity |
| **Message Queue** | Redis Streams | Integrated with existing Redis | Less feature-rich than dedicated MQ |

---

## What

*Backend technical specification and contracts*

### Service Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   API Gateway   │────▶│   Feature API   │────▶│   Database      │
│   (Kong/Nginx)  │     │   (Node.js)     │     │   (PostgreSQL)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Load Balancer │     │   Cache Layer   │     │   Message Queue │
│   (HAProxy)     │     │   (Redis)       │     │   (Redis Streams)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### API Contract Design

#### Core Endpoints

**Create Feature Item**

```http
POST /api/v1/features
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "name": "string",
  "description": "string",
  "metadata": {
    "category": "string",
    "tags": ["string"]
  }
}
```

**Response (201 Created):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Sample Feature",
    "description": "A sample feature item",
    "status": "active",
    "metadata": {
      "category": "experimental",
      "tags": ["new", "beta"]
    },
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  },
  "meta": {
    "request_id": "req_123456789",
    "version": "1.0.0",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

**List Feature Items**

```http
GET /api/v1/features?limit=20&offset=0&status=active&sort=created_at:desc
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Feature 1",
      "status": "active",
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 156,
    "has_more": true
  },
  "meta": {
    "request_id": "req_123456790",
    "version": "1.0.0",
    "timestamp": "2024-01-01T12:00:01.000Z"
  }
}
```

#### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "name",
        "issue": "required",
        "message": "Name is required and cannot be empty"
      }
    ],
    "documentation_url": "https://docs.api.example.com/errors/validation"
  },
  "meta": {
    "request_id": "req_123456791",
    "version": "1.0.0",
    "timestamp": "2024-01-01T12:00:02.000Z"
  }
}
```

### Database Design

#### Primary Tables

```sql
-- Features table
CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status feature_status DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT features_name_length CHECK (length(name) >= 1 AND length(name) <= 255),
    CONSTRAINT features_description_length CHECK (length(description) <= 2000)
);

-- Feature status enum
CREATE TYPE feature_status AS ENUM ('active', 'inactive', 'archived', 'deleted');

-- Feature audit log
CREATE TABLE feature_audit_log (
    id BIGSERIAL PRIMARY KEY,
    feature_id UUID NOT NULL REFERENCES features(id),
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_features_user_id ON features(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_features_status ON features(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_features_created_at ON features(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_features_metadata_gin ON features USING GIN(metadata);
CREATE INDEX idx_feature_audit_log_feature_id ON feature_audit_log(feature_id);
CREATE INDEX idx_feature_audit_log_created_at ON feature_audit_log(created_at DESC);
```

#### Database Optimization Strategy

- **Partitioning:** Partition audit log by month for performance
- **Soft Deletes:** Use `deleted_at` timestamp instead of hard deletes
- **JSONB Indexing:** GIN indexes on metadata for fast JSON queries
- **Connection Pooling:** pgBouncer for connection management
- **Read Replicas:** Separate read/write workloads

### Caching Strategy

#### Cache Layers

1. **Application Cache:** In-memory LRU cache for hot data
2. **Redis Cache:** Distributed cache for shared data
3. **CDN Cache:** Static content and API responses

#### Cache Patterns

```javascript
// Cache-aside pattern
async function getFeature(id) {
  // Try cache first
  const cached = await redis.get(`feature:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from database
  const feature = await db.features.findById(id);
  if (feature) {
    // Cache for 1 hour
    await redis.setex(`feature:${id}`, 3600, JSON.stringify(feature));
  }
  
  return feature;
}

// Cache invalidation
async function updateFeature(id, data) {
  const feature = await db.features.update(id, data);
  
  // Invalidate cache
  await redis.del(`feature:${id}`);
  await redis.del(`features:user:${feature.user_id}`);
  
  return feature;
}
```

### Security Design

#### Authentication & Authorization

```javascript
// JWT middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};
```

#### Input Validation

```javascript
const { body, validationResult } = require('express-validator');

// Validation rules
const createFeatureValidation = [
  body('name')
    .isLength({ min: 1, max: 255 })
    .trim()
    .escape()
    .withMessage('Name must be between 1-255 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .trim()
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be a valid JSON object')
];

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: errors.array()
      }
    });
  }
  next();
};
```

---

## How

*Implementation details and patterns*

### Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── featureController.js
│   └── healthController.js
├── services/            # Business logic
│   ├── featureService.js
│   └── auditService.js
├── repositories/        # Data access layer
│   ├── featureRepository.js
│   └── baseRepository.js
├── middleware/          # Express middleware
│   ├── auth.js
│   ├── validation.js
│   ├── rateLimit.js
│   └── errorHandler.js
├── models/             # Data models
│   ├── Feature.js
│   └── AuditLog.js
├── utils/              # Utility functions
│   ├── logger.js
│   ├── cache.js
│   └── metrics.js
├── config/             # Configuration
│   ├── database.js
│   ├── redis.js
│   └── app.js
├── migrations/         # Database migrations
│   └── 001_create_features.sql
├── seeds/              # Test data
│   └── features.js
└── tests/              # Test files
    ├── unit/
    ├── integration/
    └── fixtures/
```

### Service Layer Implementation

```javascript
// services/featureService.js
class FeatureService {
  constructor(featureRepo, auditService, cache) {
    this.featureRepo = featureRepo;
    this.auditService = auditService;
    this.cache = cache;
  }
  
  async createFeature(userId, featureData) {
    // Validate business rules
    await this.validateFeatureCreation(userId, featureData);
    
    // Create feature
    const feature = await this.featureRepo.create({
      ...featureData,
      user_id: userId
    });
    
    // Log audit event
    await this.auditService.logAction({
      feature_id: feature.id,
      user_id: userId,
      action: 'CREATE',
      new_values: feature
    });
    
    // Invalidate cache
    await this.cache.invalidatePattern(`features:user:${userId}*`);
    
    return feature;
  }
  
  async getFeatures(userId, options = {}) {
    const cacheKey = `features:user:${userId}:${JSON.stringify(options)}`;
    
    // Try cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Fetch from repository
    const features = await this.featureRepo.findByUser(userId, options);
    
    // Cache results
    await this.cache.set(cacheKey, features, { ttl: 300 }); // 5 minutes
    
    return features;
  }
  
  async validateFeatureCreation(userId, featureData) {
    // Business rule: Users can't have more than 100 active features
    const activeCount = await this.featureRepo.countActive(userId);
    if (activeCount >= 100) {
      throw new BusinessError('Maximum feature limit reached', 'FEATURE_LIMIT_EXCEEDED');
    }
    
    // Business rule: Feature names must be unique per user
    const existingFeature = await this.featureRepo.findByUserAndName(userId, featureData.name);
    if (existingFeature) {
      throw new BusinessError('Feature name already exists', 'DUPLICATE_NAME');
    }
  }
}
```

### Repository Pattern

```javascript
// repositories/featureRepository.js
class FeatureRepository extends BaseRepository {
  constructor(db) {
    super(db, 'features');
  }
  
  async findByUser(userId, options = {}) {
    const {
      limit = 20,
      offset = 0,
      status = 'active',
      sort = 'created_at:desc'
    } = options;
    
    const [field, direction] = sort.split(':');
    
    const query = this.db(this.table)
      .where('user_id', userId)
      .where('status', status)
      .whereNull('deleted_at')
      .orderBy(field, direction)
      .limit(limit)
      .offset(offset);
    
    const [data, total] = await Promise.all([
      query.clone().select('*'),
      query.clone().count('* as count').first()
    ]);
    
    return {
      data,
      pagination: {
        limit,
        offset,
        total: parseInt(total.count),
        has_more: offset + data.length < total.count
      }
    };
  }
  
  async countActive(userId) {
    const result = await this.db(this.table)
      .where('user_id', userId)
      .where('status', 'active')
      .whereNull('deleted_at')
      .count('* as count')
      .first();
    
    return parseInt(result.count);
  }
}
```

### Error Handling

```javascript
// middleware/errorHandler.js
class ErrorHandler {
  static handle(error, req, res, next) {
    const correlationId = req.headers['x-correlation-id'] || generateId();
    
    // Log error with context
    logger.error('Request error', {
      error: error.message,
      stack: error.stack,
      correlationId,
      url: req.url,
      method: req.method,
      userId: req.user?.id
    });
    
    // Business errors
    if (error instanceof BusinessError) {
      return res.status(error.statusCode || 400).json({
        error: {
          code: error.code,
          message: error.message,
          correlation_id: correlationId
        }
      });
    }
    
    // Database errors
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'Resource already exists',
          correlation_id: correlationId
        }
      });
    }
    
    // Default server error
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        correlation_id: correlationId
      }
    });
  }
}
```

### Monitoring & Metrics

```javascript
// utils/metrics.js
const prometheus = require('prom-client');

class Metrics {
  constructor() {
    this.httpRequestDuration = new prometheus.Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5]
    });
    
    this.httpRequestsTotal = new prometheus.Counter({
      name: 'http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'route', 'status_code']
    });
    
    this.databaseQueryDuration = new prometheus.Histogram({
      name: 'database_query_duration_seconds',
      help: 'Database query duration in seconds',
      labelNames: ['operation', 'table'],
      buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]
    });
    
    this.cacheHitRatio = new prometheus.Gauge({
      name: 'cache_hit_ratio',
      help: 'Cache hit ratio',
      labelNames: ['cache_type']
    });
  }
  
  recordHttpRequest(method, route, statusCode, duration) {
    const labels = { method, route, status_code: statusCode };
    this.httpRequestDuration.observe(labels, duration);
    this.httpRequestsTotal.inc(labels);
  }
  
  recordDatabaseQuery(operation, table, duration) {
    this.databaseQueryDuration.observe({ operation, table }, duration);
  }
}
```

---

## Performance Optimization

### Database Optimization

- **Connection Pooling:** PgBouncer with 25 connections per instance
- **Query Optimization:** Explain plans for all queries >10ms
- **Indexing Strategy:** Composite indexes for common query patterns
- **Partitioning:** Time-based partitioning for audit logs

### Caching Strategy

```javascript
// Multi-level caching
class CacheManager {
  constructor(localCache, redisClient) {
    this.localCache = localCache;  // LRU cache
    this.redisCache = redisClient; // Distributed cache
  }
  
  async get(key) {
    // L1: Local cache
    let value = this.localCache.get(key);
    if (value) return value;
    
    // L2: Redis cache
    value = await this.redisCache.get(key);
    if (value) {
      this.localCache.set(key, value, { ttl: 60 }); // 1 minute local TTL
      return JSON.parse(value);
    }
    
    return null;
  }
  
  async set(key, value, options = {}) {
    const serialized = JSON.stringify(value);
    
    // Set in both caches
    this.localCache.set(key, value, { ttl: 60 });
    await this.redisCache.setex(key, options.ttl || 300, serialized);
  }
}
```

### Load Testing Configuration

```javascript
// Artillery.js load test
module.exports = {
  config: {
    target: 'https://api.staging.example.com',
    phases: [
      { duration: '2m', arrivalRate: 10 },   // Warm up
      { duration: '5m', arrivalRate: 50 },   // Load test
      { duration: '2m', arrivalRate: 100 },  // Spike test
      { duration: '1m', arrivalRate: 10 }    // Cool down
    ],
    defaults: {
      headers: {
        'Authorization': 'Bearer {{ $randomString }}',
        'Content-Type': 'application/json'
      }
    }
  },
  scenarios: [
    {
      name: 'Feature CRUD workflow',
      weight: 70,
      flow: [
        { post: { url: '/api/v1/features', json: { name: '{{ $randomString }}' } } },
        { get: { url: '/api/v1/features/{{ id }}' } },
        { put: { url: '/api/v1/features/{{ id }}', json: { name: '{{ $randomString }}' } } }
      ]
    },
    {
      name: 'Feature listing',
      weight: 30,
      flow: [
        { get: { url: '/api/v1/features?limit=20&offset=0' } }
      ]
    }
  ]
};
```

---

## Deployment Architecture

### Container Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set permissions
RUN chown -R nodejs:nodejs /app
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

EXPOSE 3000

CMD ["npm", "start"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: feature-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: feature-api
  template:
    metadata:
      labels:
        app: feature-api
    spec:
      containers:
      - name: feature-api
        image: feature-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

---

## Our Philosophy
>
> *"Build-Measure-Learn isn't a phase; it's how we breathe."*

**Backend Design Principles:**

- **Observability First:** Every component must be measurable
- **Fail Explicitly:** Clear error messages and proper status codes
- **Defense in Depth:** Multiple layers of validation and security
- **Performance by Design:** Optimize for the 99th percentile user

---

## Craftsmanship Debt Assessment

| Component | Debt Score (1-5) | Justification | Payback Timeline |
|-----------|------------------|---------------|------------------|
| **Error Handling** | 2 | Basic structure in place | Enhance in Sprint 2 |
| **Monitoring** | 3 | Missing custom metrics | Add in Sprint 3 |
| **Caching** | 4 | Simple cache implementation | Optimize after MVP |
| **Testing** | 2 | Good unit test coverage | Add integration tests |
| **Documentation** | 3 | API docs exist, missing runbooks | Complete post-launch |

**Total Debt Score:** 14/25 (Acceptable for MVP)  
**Review Date:** After 2 weeks in production

---

**Links:**

- **OpenAPI Spec:** *[Link to API documentation]*
- **Database Schema:** *[Link to ERD]*
- **Monitoring Dashboard:** *[Link to Grafana/DataDog]*
- **Runbook:** *[Link to operational procedures]*
- **Load Test Results:** *[Link to performance reports]*

---

**Last Updated:** *[Date]* | **Next Review:** *[After load testing completion]*
