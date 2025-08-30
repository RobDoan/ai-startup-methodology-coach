# Backend Test Plan: *[Feature Name]*

**Parent Requirements:** [../requirements.md](../requirements.md)  
**Backend Design:** [./design.md](./design.md)  
**Tasks:** [./tasks.md](./tasks.md)  
**Test Status:** 🟡 Planning | 🟠 In Progress | ✅ Complete | ❌ Failed  

---

## Testing Philosophy
>
> *"We try to prove ourselves wrong, not right."*

**Our Testing Strategy:**

- **Unit Tests (70%):** Fast feedback on business logic and edge cases
- **Integration Tests (20%):** Database interactions and external services
- **Contract Tests (5%):** API contract validation
- **End-to-End Tests (5%):** Critical user journeys through the API

**Null Hypothesis:** *The backend implementation will not reliably support the expected load and use cases*  
**Goal:** Gather evidence to validate system reliability, performance, and correctness

---

## Test Coverage Strategy

### What We're Testing
>
> **Mapping tests to requirements and design decisions**

| Requirement/Component | Test Type | Success Criteria | Risk Level |
|----------------------|-----------|------------------|------------|
| **User Authentication** | Integration | JWT validation works correctly | High |
| **Data Validation** | Unit | Invalid inputs rejected with proper errors | High |
| **Business Logic** | Unit | Feature creation rules enforced | Medium |
| **Database Operations** | Integration | CRUD operations maintain data integrity | High |
| **API Response Format** | Contract | All responses match OpenAPI spec | Medium |
| **Error Handling** | Unit + Integration | All error scenarios handled gracefully | High |
| **Performance** | Load | <100ms P95 response time under load | High |
| **Security** | Security | No unauthorized access possible | Critical |

### Test Environment Matrix

| Environment | Database | External APIs | Load Level | Purpose |
|-------------|----------|---------------|------------|----------|
| **Unit** | In-memory/Mock | Mocked | N/A | Fast feedback |
| **Integration** | Test DB | Staging APIs | Low | Component interaction |
| **Staging** | Staging DB | Staging APIs | Medium | Pre-production validation |
| **Load Test** | Dedicated DB | Mock/Staging | High | Performance validation |
| **Production** | Production DB | Production APIs | Real traffic | Monitoring |

---

## Unit Tests

*Testing individual components in isolation*

### Service Layer Tests

#### FeatureService Tests

```javascript
// tests/unit/services/featureService.test.js
describe('FeatureService', () => {
  let featureService;
  let mockRepo;
  let mockAuditService;
  let mockCache;
  
  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUser: jest.fn(),
      countActive: jest.fn()
    };
    mockAuditService = {
      logAction: jest.fn()
    };
    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      invalidatePattern: jest.fn()
    };
    
    featureService = new FeatureService(mockRepo, mockAuditService, mockCache);
  });
  
  describe('createFeature', () => {
    it('should create feature with valid data', async () => {
      const userId = 'user-123';
      const featureData = { name: 'Test Feature', description: 'Test' };
      const expectedFeature = { id: 'feat-123', ...featureData, user_id: userId };
      
      mockRepo.countActive.mockResolvedValue(5);
      mockRepo.findByUserAndName.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(expectedFeature);
      
      const result = await featureService.createFeature(userId, featureData);
      
      expect(result).toEqual(expectedFeature);
      expect(mockRepo.create).toHaveBeenCalledWith({
        ...featureData,
        user_id: userId
      });
      expect(mockAuditService.logAction).toHaveBeenCalled();
      expect(mockCache.invalidatePattern).toHaveBeenCalledWith(`features:user:${userId}*`);
    });
    
    it('should reject creation when user exceeds feature limit', async () => {
      const userId = 'user-123';
      const featureData = { name: 'Test Feature' };
      
      mockRepo.countActive.mockResolvedValue(100);
      
      await expect(featureService.createFeature(userId, featureData))
        .rejects
        .toThrow('Maximum feature limit reached');
      
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
    
    it('should reject duplicate feature names for same user', async () => {
      const userId = 'user-123';
      const featureData = { name: 'Existing Feature' };
      
      mockRepo.countActive.mockResolvedValue(5);
      mockRepo.findByUserAndName.mockResolvedValue({ id: 'existing-123' });
      
      await expect(featureService.createFeature(userId, featureData))
        .rejects
        .toThrow('Feature name already exists');
      
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });
  
  describe('getFeatures', () => {
    it('should return cached data when available', async () => {
      const userId = 'user-123';
      const cachedData = { data: [{ id: 'feat-1' }], pagination: {} };
      
      mockCache.get.mockResolvedValue(cachedData);
      
      const result = await featureService.getFeatures(userId);
      
      expect(result).toEqual(cachedData);
      expect(mockRepo.findByUser).not.toHaveBeenCalled();
    });
    
    it('should fetch from repository and cache when not cached', async () => {
      const userId = 'user-123';
      const repoData = { data: [{ id: 'feat-1' }], pagination: {} };
      
      mockCache.get.mockResolvedValue(null);
      mockRepo.findByUser.mockResolvedValue(repoData);
      
      const result = await featureService.getFeatures(userId);
      
      expect(result).toEqual(repoData);
      expect(mockRepo.findByUser).toHaveBeenCalledWith(userId, {});
      expect(mockCache.set).toHaveBeenCalled();
    });
  });
});
```

#### Repository Tests

```javascript
// tests/unit/repositories/featureRepository.test.js
describe('FeatureRepository', () => {
  let featureRepo;
  let mockDb;
  
  beforeEach(() => {
    mockDb = {
      features: {
        where: jest.fn().mockReturnThis(),
        whereNull: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        count: jest.fn().mockReturnThis(),
        first: jest.fn(),
        clone: jest.fn().mockReturnThis()
      }
    };
    
    featureRepo = new FeatureRepository(mockDb);
  });
  
  describe('findByUser', () => {
    it('should build correct query with default options', async () => {
      const userId = 'user-123';
      const mockData = [{ id: 'feat-1' }, { id: 'feat-2' }];
      const mockCount = { count: '10' };
      
      mockDb.features.select.mockResolvedValue(mockData);
      mockDb.features.first.mockResolvedValue(mockCount);
      
      const result = await featureRepo.findByUser(userId);
      
      expect(mockDb.features.where).toHaveBeenCalledWith('user_id', userId);
      expect(mockDb.features.where).toHaveBeenCalledWith('status', 'active');
      expect(mockDb.features.whereNull).toHaveBeenCalledWith('deleted_at');
      expect(mockDb.features.orderBy).toHaveBeenCalledWith('created_at', 'desc');
      expect(mockDb.features.limit).toHaveBeenCalledWith(20);
      expect(mockDb.features.offset).toHaveBeenCalledWith(0);
      
      expect(result).toEqual({
        data: mockData,
        pagination: {
          limit: 20,
          offset: 0,
          total: 10,
          has_more: false
        }
      });
    });
  });
});
```

### Validation Tests

```javascript
// tests/unit/middleware/validation.test.js
describe('Validation Middleware', () => {
  describe('createFeatureValidation', () => {
    it('should pass valid feature data', async () => {
      const req = {
        body: {
          name: 'Valid Feature Name',
          description: 'Valid description',
          metadata: { category: 'test' }
        }
      };
      
      const errors = await runValidation(createFeatureValidation, req);
      expect(errors.isEmpty()).toBe(true);
    });
    
    it('should reject missing name', async () => {
      const req = {
        body: {
          description: 'Valid description'
        }
      };
      
      const errors = await runValidation(createFeatureValidation, req);
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()[0].param).toBe('name');
    });
    
    it('should reject name that is too long', async () => {
      const req = {
        body: {
          name: 'x'.repeat(256), // Too long
          description: 'Valid description'
        }
      };
      
      const errors = await runValidation(createFeatureValidation, req);
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()[0].param).toBe('name');
    });
    
    it('should sanitize HTML in inputs', async () => {
      const req = {
        body: {
          name: '<script>alert("xss")</script>Feature',
          description: '<img src=x onerror=alert(1)>Description'
        }
      };
      
      await runValidation(createFeatureValidation, req);
      
      expect(req.body.name).not.toContain('<script>');
      expect(req.body.description).not.toContain('<img');
    });
  });
});
```

---

## Integration Tests

*Testing component interactions with real dependencies*

### Database Integration Tests

```javascript
// tests/integration/database.test.js
describe('Database Integration', () => {
  let db;
  let testUser;
  
  beforeAll(async () => {
    db = await createTestDatabase();
    await runMigrations(db);
  });
  
  afterAll(async () => {
    await cleanupTestDatabase(db);
  });
  
  beforeEach(async () => {
    await seedDatabase(db);
    testUser = await db.users.create({
      id: 'test-user-123',
      email: 'test@example.com'
    });
  });
  
  afterEach(async () => {
    await cleanupData(db);
  });
  
  describe('Feature CRUD Operations', () => {
    it('should create and retrieve feature', async () => {
      const featureData = {
        name: 'Test Feature',
        description: 'Integration test feature',
        user_id: testUser.id,
        metadata: { category: 'test' }
      };
      
      const created = await db.features.create(featureData);
      
      expect(created.id).toBeDefined();
      expect(created.name).toBe(featureData.name);
      expect(created.created_at).toBeDefined();
      
      const retrieved = await db.features.findById(created.id);
      expect(retrieved).toEqual(expect.objectContaining(featureData));
    });
    
    it('should enforce unique constraint on user_id + name', async () => {
      const featureData = {
        name: 'Unique Feature',
        user_id: testUser.id
      };
      
      await db.features.create(featureData);
      
      await expect(db.features.create(featureData))
        .rejects
        .toThrow(/unique constraint/);
    });
    
    it('should soft delete features', async () => {
      const feature = await db.features.create({
        name: 'To Delete',
        user_id: testUser.id
      });
      
      await db.features.softDelete(feature.id);
      
      const deleted = await db.features.findById(feature.id);
      expect(deleted.deleted_at).not.toBeNull();
      
      const activeFeatures = await db.features.findActiveByUser(testUser.id);
      expect(activeFeatures.find(f => f.id === feature.id)).toBeUndefined();
    });
  });
  
  describe('Performance Tests', () => {
    it('should handle bulk operations efficiently', async () => {
      const features = Array.from({ length: 100 }, (_, i) => ({
        name: `Bulk Feature ${i}`,
        user_id: testUser.id
      }));
      
      const startTime = Date.now();
      await db.features.bulkCreate(features);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in <1s
      
      const count = await db.features.countByUser(testUser.id);
      expect(count).toBe(100);
    });
    
    it('should use indexes for common queries', async () => {
      // Create test data
      await db.features.bulkCreate(
        Array.from({ length: 1000 }, (_, i) => ({
          name: `Feature ${i}`,
          user_id: testUser.id,
          status: i % 2 === 0 ? 'active' : 'inactive'
        }))
      );
      
      const startTime = Date.now();
      const activeFeatures = await db.features.findByUserAndStatus(testUser.id, 'active');
      const queryTime = Date.now() - startTime;
      
      expect(queryTime).toBeLessThan(100); // Should use index efficiently
      expect(activeFeatures.length).toBe(500);
    });
  });
});
```

### API Integration Tests

```javascript
// tests/integration/api.test.js
describe('Feature API Integration', () => {
  let app;
  let testUser;
  let authToken;
  
  beforeAll(async () => {
    app = await createTestApp();
    testUser = await createTestUser();
    authToken = await generateTestToken(testUser);
  });
  
  afterAll(async () => {
    await cleanupTestApp();
  });
  
  beforeEach(async () => {
    await cleanupTestData();
  });
  
  describe('POST /api/v1/features', () => {
    it('should create feature with valid data', async () => {
      const featureData = {
        name: 'Test Feature',
        description: 'API integration test',
        metadata: { category: 'test' }
      };
      
      const response = await request(app)
        .post('/api/v1/features')
        .set('Authorization', `Bearer ${authToken}`)
        .send(featureData)
        .expect(201);
      
      expect(response.body.data).toMatchObject({
        name: featureData.name,
        description: featureData.description,
        status: 'active',
        user_id: testUser.id
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.meta.request_id).toBeDefined();
    });
    
    it('should return 400 for invalid data', async () => {
      const invalidData = {
        name: '', // Empty name
        description: 'x'.repeat(2001) // Too long
      };
      
      const response = await request(app)
        .post('/api/v1/features')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
      
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toHaveLength(2);
    });
    
    it('should return 401 without authentication', async () => {
      const featureData = { name: 'Test Feature' };
      
      await request(app)
        .post('/api/v1/features')
        .send(featureData)
        .expect(401);
    });
    
    it('should return 409 for duplicate name', async () => {
      const featureData = { name: 'Duplicate Feature' };
      
      // Create first feature
      await request(app)
        .post('/api/v1/features')
        .set('Authorization', `Bearer ${authToken}`)
        .send(featureData)
        .expect(201);
      
      // Try to create duplicate
      const response = await request(app)
        .post('/api/v1/features')
        .set('Authorization', `Bearer ${authToken}`)
        .send(featureData)
        .expect(409);
      
      expect(response.body.error.code).toBe('DUPLICATE_NAME');
    });
  });
  
  describe('GET /api/v1/features', () => {
    beforeEach(async () => {
      // Create test features
      const features = Array.from({ length: 25 }, (_, i) => ({
        name: `Feature ${i}`,
        description: `Test feature ${i}`,
        status: i < 20 ? 'active' : 'inactive'
      }));
      
      for (const feature of features) {
        await request(app)
          .post('/api/v1/features')
          .set('Authorization', `Bearer ${authToken}`)
          .send(feature);
      }
    });
    
    it('should return paginated features', async () => {
      const response = await request(app)
        .get('/api/v1/features?limit=10&offset=0')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination).toEqual({
        limit: 10,
        offset: 0,
        total: 20, // Only active features
        has_more: true
      });
    });
    
    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/v1/features?status=inactive')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.data).toHaveLength(5);
      expect(response.body.data.every(f => f.status === 'inactive')).toBe(true);
    });
    
    it('should sort features correctly', async () => {
      const response = await request(app)
        .get('/api/v1/features?sort=name:asc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      const names = response.body.data.map(f => f.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });
  });
});
```

---

## Contract Tests

*Validating API contracts and external integrations*

### OpenAPI Contract Tests

```javascript
// tests/contract/openapi.test.js
const { OpenApiValidator } = require('express-openapi-validator');

describe('OpenAPI Contract Validation', () => {
  let app;
  let validator;
  
  beforeAll(async () => {
    app = await createTestApp();
    validator = new OpenApiValidator({
      apiSpec: './docs/openapi.yml',
      validateRequests: true,
      validateResponses: true
    });
  });
  
  describe('Feature API Endpoints', () => {
    it('should validate request schemas', async () => {
      const invalidRequest = {
        name: 123, // Should be string
        extra_field: 'not allowed'
      };
      
      const response = await request(app)
        .post('/api/v1/features')
        .set('Authorization', `Bearer ${testToken}`)
        .send(invalidRequest);
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
    
    it('should validate response schemas', async () => {
      const validRequest = {
        name: 'Contract Test Feature',
        description: 'Testing API contract'
      };
      
      const response = await request(app)
        .post('/api/v1/features')
        .set('Authorization', `Bearer ${testToken}`)
        .send(validRequest)
        .expect(201);
      
      // Validate response structure
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('created_at');
      expect(response.body.meta).toHaveProperty('request_id');
      expect(response.body.meta).toHaveProperty('version');
    });
  });
});
```

---

## Performance Tests

*Load testing and performance validation*

### Load Testing Configuration

```javascript
// tests/performance/load-test.js
const autocannon = require('autocannon');

describe('Load Testing', () => {
  let app;
  let baseUrl;
  
  beforeAll(async () => {
    app = await startTestServer();
    baseUrl = `http://localhost:${app.port}`;
  });
  
  afterAll(async () => {
    await stopTestServer(app);
  });
  
  it('should handle create feature load', async () => {
    const result = await autocannon({
      url: `${baseUrl}/api/v1/features`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Load Test Feature {{REQUEST_ID}}',
        description: 'Load testing feature creation'
      }),
      duration: 30, // 30 seconds
      connections: 50
    });
    
    expect(result['2xx']).toBeGreaterThan(0);
    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.latency.p95).toBeLessThan(200); // P95 < 200ms
    expect(result.requests.average).toBeGreaterThan(100); // >100 RPS
  }, 60000);
  
  it('should handle get features load', async () => {
    // Pre-populate with test data
    await createTestFeatures(1000);
    
    const result = await autocannon({
      url: `${baseUrl}/api/v1/features`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${testToken}`
      },
      duration: 30,
      connections: 100
    });
    
    expect(result['2xx']).toBeGreaterThan(0);
    expect(result.errors).toBe(0);
    expect(result.latency.p95).toBeLessThan(100); // P95 < 100ms for reads
    expect(result.requests.average).toBeGreaterThan(500); // >500 RPS for reads
  }, 60000);
});
```

### Database Performance Tests

```javascript
// tests/performance/database.test.js
describe('Database Performance', () => {
  let db;
  
  beforeAll(async () => {
    db = await createTestDatabase();
    await seedLargeDataset(db, 10000); // 10k records
  });
  
  afterAll(async () => {
    await cleanupTestDatabase(db);
  });
  
  it('should perform queries within acceptable time limits', async () => {
    const queries = [
      () => db.features.findByUser('user-123', { limit: 20 }),
      () => db.features.findById('feature-123'),
      () => db.features.countActive('user-123'),
      () => db.features.search('test query', 'user-123')
    ];
    
    for (const query of queries) {
      const startTime = Date.now();
      await query();
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(50); // All queries < 50ms
    }
  });
  
  it('should maintain performance under concurrent load', async () => {
    const concurrentQueries = Array.from({ length: 50 }, (_, i) => 
      db.features.findByUser(`user-${i % 10}`, { limit: 20 })
    );
    
    const startTime = Date.now();
    await Promise.all(concurrentQueries);
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(1000); // 50 concurrent queries < 1s
  });
});
```

---

## Security Tests

*Authentication, authorization, and vulnerability testing*

### Authentication Tests

```javascript
// tests/security/auth.test.js
describe('Authentication Security', () => {
  let app;
  
  beforeAll(async () => {
    app = await createTestApp();
  });
  
  describe('JWT Token Validation', () => {
    it('should reject requests without token', async () => {
      await request(app)
        .get('/api/v1/features')
        .expect(401);
    });
    
    it('should reject requests with invalid token', async () => {
      await request(app)
        .get('/api/v1/features')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);
    });
    
    it('should reject expired tokens', async () => {
      const expiredToken = jwt.sign(
        { userId: 'user-123', exp: Math.floor(Date.now() / 1000) - 60 },
        process.env.JWT_SECRET
      );
      
      await request(app)
        .get('/api/v1/features')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(403);
    });
    
    it('should accept valid tokens', async () => {
      const validToken = jwt.sign(
        { userId: 'user-123', role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      await request(app)
        .get('/api/v1/features')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
    });
  });
});
```

### Input Validation Security Tests

```javascript
// tests/security/input-validation.test.js
describe('Input Validation Security', () => {
  let app;
  let authToken;
  
  beforeAll(async () => {
    app = await createTestApp();
    authToken = await generateTestToken();
  });
  
  describe('SQL Injection Prevention', () => {
    it('should prevent SQL injection in name field', async () => {
      const maliciousName = "'; DROP TABLE features; --";
      
      const response = await request(app)
        .post('/api/v1/features')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: maliciousName })
        .expect(400); // Should be rejected by validation
      
      // Verify table still exists
      const features = await request(app)
        .get('/api/v1/features')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
  
  describe('XSS Prevention', () => {
    it('should sanitize HTML in feature description', async () => {
      const xssPayload = '<script>alert("xss")</script>';
      
      const response = await request(app)
        .post('/api/v1/features')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'XSS Test',
          description: xssPayload
        })
        .expect(201);
      
      expect(response.body.data.description).not.toContain('<script>');
      expect(response.body.data.description).not.toContain('alert');
    });
  });
  
  describe('NoSQL Injection Prevention', () => {
    it('should prevent NoSQL injection in metadata', async () => {
      const maliciousMetadata = {
        $where: 'function() { return true; }',
        $regex: '.*'
      };
      
      const response = await request(app)
        .post('/api/v1/features')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'NoSQL Test',
          metadata: maliciousMetadata
        })
        .expect(400); // Should be rejected
      
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

---

## Test Automation & CI/CD

### Test Pipeline Configuration

```yaml
# .github/workflows/test.yml
name: Backend Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit --coverage
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
  
  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgres://postgres:testpass@localhost:5432/test_db
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgres://postgres:testpass@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
  
  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run security audit
        run: npm audit --audit-level high
      
      - name: Run OWASP ZAP security scan
        uses: zaproxy/action-full-scan@v0.4.0
        with:
          target: 'http://localhost:3000'
```

---

## Test Metrics & Reporting

### Coverage Requirements

| Test Type | Minimum Coverage | Current | Target |
|-----------|------------------|---------|--------|
| **Unit Tests** | 80% | *[TBD]* | 85% |
| **Integration Tests** | 60% | *[TBD]* | 70% |
| **API Endpoints** | 100% | *[TBD]* | 100% |
| **Error Paths** | 90% | *[TBD]* | 95% |

### Performance Benchmarks

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Unit Test Execution** | <30s | *[TBD]* | 🟡 |
| **Integration Test Execution** | <5min | *[TBD]* | 🟡 |
| **Load Test (P95 Response Time)** | <200ms | *[TBD]* | 🟡 |
| **Load Test (Error Rate)** | <1% | *[TBD]* | 🟡 |
| **Database Query Performance** | <50ms | *[TBD]* | 🟡 |

---

## Failure Modes & Recovery

### Test Failure Response Plan

1. **Unit Test Failure:** Block PR merge, require fix
2. **Integration Test Failure:** Investigate environment/dependencies
3. **Performance Test Failure:** Analyze bottlenecks, optimize
4. **Security Test Failure:** Immediate security review required

### Test Environment Recovery

```bash
#!/bin/bash
# scripts/reset-test-env.sh

echo "Resetting test environment..."

# Stop running containers
docker-compose -f docker-compose.test.yml down -v

# Remove test volumes
docker volume prune -f

# Start fresh environment
docker-compose -f docker-compose.test.yml up -d

# Wait for services to be ready
./scripts/wait-for-services.sh

# Run migrations
npm run db:migrate:test

# Seed test data
npm run db:seed:test

echo "Test environment ready!"
```

---

## Our Philosophy
>
> *"Data Over Drama - We separate what the data says from what we wish it said."*

**Testing Principles:**

- **Test Behavior, Not Implementation:** Focus on what the system does
- **Fail Fast, Fail Explicit:** Make failures obvious and actionable
- **Test Like a Hacker:** Assume malicious input and edge cases
- **Measure Everything:** If you can't measure it, you can't improve it

---

## Learning from Failures

### Test Failure Analysis Template

```markdown
## Test Failure Post-Mortem: [Date]

**Failed Test:** [Test name and description]
**Failure Type:** Unit | Integration | Performance | Security
**Root Cause:** [What actually caused the failure]
**Detection Time:** [How long until we noticed]
**Resolution Time:** [How long to fix]

### What We Learned
- [Insight 1]
- [Insight 2]

### Actions Taken
- [Action 1]
- [Action 2]

### Prevention
- [How we'll prevent this in the future]
```

---

**Links:**

- **Test Results Dashboard:** *[Link to CI/CD test results]*
- **Coverage Reports:** *[Link to code coverage dashboard]*
- **Performance Reports:** *[Link to load test results]*
- **Security Scan Results:** *[Link to security audit reports]*

---

**Last Updated:** *[Date]* | **Next Review:** *[After each major release]*
