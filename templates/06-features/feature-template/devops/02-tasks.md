# DevOps Tasks: *[Feature Name]*

**Parent Requirements:** [../requirements.md](../requirements.md)  
**Parent Design:** [../design.md](../design.md)  
**DevOps Design:** [./design.md](./design.md)  
**Sprint:** *[Sprint Number]*  
**Engineer:** *@devops-engineer*  

---

## Experiment Context
>
> **Connecting the "Why" to the "How" - Infrastructure serves the hypothesis**

**Hypothesis Being Tested:** *[Copy from requirements.md - e.g., "We believe that users will adopt the new dashboard because it reduces report generation time"]*  
**Primary Success Metric:** *[Copy from requirements.md - e.g., "20% increase in weekly active users for the reporting feature"]*  
**Infrastructure Requirements:** *[e.g., "Must support A/B testing for 50% of users"]*  
**Rollback Criteria:** *[e.g., "Rollback if response times >500ms or error rates >2%"]*

---

## Task Overview

*Infrastructure and deployment tasks supporting the feature experiment*

**Total Story Points:** *[Sum of all tasks]*  
**Infrastructure Dependencies:** *[List of external services/resources needed]*  
**Security Review Required:** Yes | No  
**Compliance Requirements:** *[Any regulatory/compliance considerations]*  

---

## Sprint Tasks

### 🔥 Critical Infrastructure (Must Have)

*Tasks that block deployment or cause service disruption*

- [ ] **[DO-001]** Provision infrastructure resources *(5 points)*
  - Set up database instances (staging, production)
  - Configure Redis cluster for caching
  - Provision load balancers and networking
  - Set up monitoring and logging infrastructure
  - **Success Criteria:** All infrastructure provisioned and health checks passing

- [ ] **[DO-002]** Configure CI/CD pipeline *(4 points)*
  - Set up build and test stages
  - Configure deployment automation
  - Implement blue-green deployment strategy
  - Add rollback mechanisms
  - **Success Criteria:** Pipeline deploys successfully to staging

- [ ] **[DO-003]** Implement monitoring and alerting *(4 points)*
  - Set up application performance monitoring
  - Configure infrastructure monitoring
  - Create alerting rules and notification channels
  - Set up log aggregation and analysis
  - **Success Criteria:** All key metrics monitored with proper alerts

### 🔒 Security & Compliance (Should Have)

*Security-critical tasks that protect the system*

- [ ] **[DO-004]** Configure security controls *(3 points)*
  - Set up WAF rules and rate limiting
  - Configure TLS/SSL certificates
  - Implement network security groups
  - Set up secrets management
  - **Success Criteria:** Security scan passes with no high/critical issues

- [ ] **[DO-005]** Implement backup and disaster recovery *(3 points)*
  - Configure automated database backups
  - Set up cross-region replication
  - Create disaster recovery runbook
  - Test backup restoration procedures
  - **Success Criteria:** Recovery procedures tested and documented

- [ ] **[DO-006]** Set up compliance monitoring *(2 points)*
  - Configure audit logging
  - Implement data retention policies
  - Set up compliance reporting
  - **Success Criteria:** All compliance requirements tracked

### 🎨 Optimization (Nice to Have)

*Performance and cost optimization tasks*

- [ ] **[DO-007]** Optimize resource utilization *(2 points)*
  - Configure auto-scaling policies
  - Implement resource right-sizing
  - Set up cost monitoring and alerts
  - **Success Criteria:** Resources scale appropriately under load

- [ ] **[DO-008]** Implement advanced observability *(3 points)*
  - Set up distributed tracing
  - Configure custom dashboards
  - Implement SLI/SLO monitoring
  - **Success Criteria:** End-to-end request tracing available

---

## Infrastructure Architecture

### Production Environment

```
┌─────────────────────┐
│     Load Balancer       │
│     (ALB/HAProxy)       │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│    Application Tier    │
│   (3x Kubernetes      │
│      Pods)            │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│      Data Tier         │
│  PostgreSQL Primary   │
│  + Read Replicas      │
│  Redis Cluster        │
└─────────────────────┘
```

### Resource Requirements

| Component | Staging | Production | Scaling |
|-----------|---------|------------|----------|
| **Application Pods** | 2 x 1 CPU, 2GB RAM | 3 x 2 CPU, 4GB RAM | HPA: 3-10 pods |
| **Database** | db.t3.medium | db.r5.xlarge | Read replicas |
| **Redis** | cache.t3.micro | cache.r5.large | Cluster mode |
| **Load Balancer** | ALB | ALB | Auto-scaling |

---

## Deployment Strategy

### Blue-Green Deployment Process

1. **Pre-deployment Checks**
   - [ ] All tests passing in CI/CD
   - [ ] Database migrations tested
   - [ ] Feature flags configured
   - [ ] Rollback plan ready

2. **Green Environment Setup**
   - [ ] Deploy new version to green environment
   - [ ] Run smoke tests on green environment
   - [ ] Verify database connectivity
   - [ ] Check external service integrations

3. **Traffic Switch**
   - [ ] Switch 10% traffic to green (canary)
   - [ ] Monitor key metrics for 10 minutes
   - [ ] Switch 50% traffic if metrics are healthy
   - [ ] Monitor for additional 10 minutes
   - [ ] Switch 100% traffic to green

4. **Post-deployment Validation**
   - [ ] Run full test suite against production
   - [ ] Verify all monitoring dashboards
   - [ ] Check error rates and response times
   - [ ] Validate business metrics

### Rollback Procedures

```bash
# Emergency rollback script
#!/bin/bash
set -e

echo "Starting emergency rollback..."

# Switch traffic back to blue environment
kubectl patch service feature-service -p '{"spec":{"selector":{"version":"blue"}}}'

# Verify rollback
echo "Waiting for traffic switch..."
sleep 30

# Check health
if curl -f http://api.example.com/health; then
    echo "Rollback successful"
    # Notify team
    slack-notify "Feature rollback completed successfully"
else
    echo "Rollback failed - manual intervention required"
    exit 1
fi
```

---

## Monitoring & Observability

### Key Metrics to Monitor

| Metric Category | Specific Metrics | Alert Threshold | Action |
|----------------|------------------|-----------------|--------|
| **Application** | Response time (P95) | >200ms for 5min | Page on-call |
| **Application** | Error rate | >1% for 2min | Page on-call |
| **Application** | Request throughput | <50% of baseline | Investigate |
| **Infrastructure** | CPU utilization | >80% for 10min | Auto-scale |
| **Infrastructure** | Memory usage | >85% for 5min | Alert team |
| **Database** | Connection count | >80% of max | Scale up |
| **Database** | Query response time | >100ms P95 | Optimize queries |
| **Security** | Failed auth attempts | >100/min | Block IP |

### Monitoring Stack Configuration

```yaml
# monitoring/prometheus-config.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'feature-api'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: feature-api
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_port]
        target_label: __address__
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: ${1}:${2}
```

### Alert Rules

```yaml
# monitoring/alert-rules.yml
groups:
  - name: feature-api-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.01
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }}"
      
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 0.2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow response times detected"
          description: "P95 response time is {{ $value }}s"
      
      - alert: DatabaseConnectionsHigh
        expr: pg_stat_database_numbackends / pg_settings_max_connections > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Database connections approaching limit"
```

---

## Security Configuration

### Infrastructure Security

```yaml
# security/network-policies.yml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: feature-api-netpol
spec:
  podSelector:
    matchLabels:
      app: feature-api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: nginx-ingress
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgresql
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - podSelector:
        matchLabels:
          app: redis
    ports:
    - protocol: TCP
      port: 6379
```

### Secrets Management

```yaml
# security/secrets.yml
apiVersion: v1
kind: Secret
metadata:
  name: feature-api-secrets
type: Opaque
stringData:
  database-url: "postgresql://user:pass@db:5432/features"
  redis-url: "redis://redis:6379/0"
  jwt-secret: "{{ .Values.jwtSecret }}"
  api-key: "{{ .Values.thirdPartyApiKey }}"
```

---

## Backup & Disaster Recovery

### Backup Strategy

| Data Type | Frequency | Retention | Recovery Time Objective |
|-----------|-----------|-----------|------------------------|
| **Database** | Every 6 hours | 30 days | <1 hour |
| **Configuration** | On every change | Indefinite | <15 minutes |
| **Application Logs** | Real-time | 90 days | N/A |
| **Metrics Data** | Real-time | 1 year | N/A |

### Disaster Recovery Plan

```bash
#!/bin/bash
# disaster-recovery/restore-database.sh

set -e

BACKUP_FILE=$1
TARGET_DB=$2

if [ -z "$BACKUP_FILE" ] || [ -z "$TARGET_DB" ]; then
    echo "Usage: $0 <backup_file> <target_database>"
    exit 1
fi

echo "Starting database restoration..."

# Stop application to prevent writes
kubectl scale deployment feature-api --replicas=0

# Restore database
pg_restore -h $DB_HOST -U $DB_USER -d $TARGET_DB $BACKUP_FILE

# Restart application
kubectl scale deployment feature-api --replicas=3

# Wait for pods to be ready
kubectl wait --for=condition=Ready pod -l app=feature-api --timeout=300s

# Verify restoration
if curl -f http://api.example.com/health; then
    echo "Database restoration completed successfully"
else
    echo "Database restoration failed - manual intervention required"
    exit 1
fi
```

---

## Performance Optimization

### Auto-scaling Configuration

```yaml
# scaling/hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: feature-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: feature-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"
```

### Database Performance Tuning

```sql
-- Database optimization settings
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Reload configuration
SELECT pg_reload_conf();
```

---

## Cost Optimization

### Resource Right-sizing

| Resource | Current | Optimized | Monthly Savings |
|----------|---------|-----------|----------------|
| **Application Instances** | 3 x m5.large | 3 x m5.medium | $45 |
| **Database** | db.r5.xlarge | db.r5.large | $180 |
| **Redis** | cache.r5.large | cache.m5.medium | $90 |
| **Load Balancer** | ALB | ALB (optimized) | $20 |
| **Total** | | | **$335/month** |

### Cost Monitoring Alerts

```yaml
# cost/budget-alerts.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cost-alerts
data:
  budget-threshold: "1000" # $1000/month
  alert-email: "devops@company.com"
  cost-tags: |
    Environment=production
    Team=feature-team
    Application=feature-api
```

---

## Definition of Done

*Checklist for every DevOps task*

- [ ] Infrastructure deployed and accessible
- [ ] All security controls implemented and tested
- [ ] Monitoring and alerting configured and tested
- [ ] Backup and recovery procedures tested
- [ ] Performance benchmarks met
- [ ] Cost optimization implemented
- [ ] Documentation updated (runbooks, architecture diagrams)
- [ ] Team trained on new procedures
- [ ] Compliance requirements verified
- [ ] Disaster recovery plan tested

---

## Dependencies & Blockers

### External Dependencies

- [ ] **Cloud Provider:** Resource quotas increased
- [ ] **Security Team:** Security review completed
- [ ] **Network Team:** Firewall rules configured
- [ ] **Compliance:** Audit requirements clarified

### Internal Blockers

- **Application Team:** Container images need health check endpoints
- **Database Team:** Migration scripts need review
- **Security Team:** Secrets rotation policy needs definition

### Blocking Others

- **QA Team:** Staging environment needed by *[date]*
- **Product Team:** Analytics dashboards required by *[date]*
- **Support Team:** Monitoring access needed by *[date]*

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **Infrastructure outage** | Medium | High | *Multi-AZ deployment, automated failover* |
| **Security breach** | Low | Critical | *Defense in depth, regular security scans* |
| **Data loss** | Low | Critical | *Automated backups, tested recovery procedures* |
| **Performance degradation** | Medium | Medium | *Auto-scaling, performance monitoring* |
| **Cost overrun** | Medium | Medium | *Budget alerts, resource optimization* |
| **Compliance violation** | Low | High | *Audit logging, regular compliance checks* |

---

## Our Philosophy
>
> *"Guardrails, Not Handcuffs - Our process exists to make the safe path the easy path."*

**DevOps Principles:**

- **Automation First:** Manual processes are error-prone and don't scale
- **Infrastructure as Code:** Everything should be version-controlled and reproducible
- **Security by Design:** Build security into every layer from the start
- **Measure Everything:** You can't improve what you don't measure
- **Fail Fast, Recover Faster:** Design for failure and quick recovery

---

## Operational Runbooks

### Common Operational Tasks

| Task | Frequency | Automation Level | Runbook Link |
|------|-----------|------------------|---------------|
| **Deploy new version** | As needed | Fully automated | *[Link to deployment runbook]* |
| **Scale application** | Auto + manual | Semi-automated | *[Link to scaling runbook]* |
| **Database maintenance** | Weekly | Semi-automated | *[Link to DB maintenance]* |
| **Certificate renewal** | Every 90 days | Fully automated | *[Link to cert management]* |
| **Backup verification** | Daily | Fully automated | *[Link to backup procedures]* |
| **Security patching** | Monthly | Semi-automated | *[Link to patching guide]* |

---

## Learning Log

*Capturing operational insights*

### Infrastructure Decisions: *[Date]*

- **Decision:** *[e.g., Chose Kubernetes over ECS]*
- **Rationale:** *[Why this choice was made]*
- **Outcome:** *[How it worked out in practice]*
- **Lessons:** *[What we learned]*

### Incident Learnings: *[Date]*

- **Incident:** *[Brief description]*
- **Root Cause:** *[What actually caused the issue]*
- **Resolution:** *[How we fixed it]*
- **Prevention:** *[Changes made to prevent recurrence]*

---

**Links:**

- **Infrastructure Diagrams:** *[Link to architecture documentation]*
- **Monitoring Dashboards:** *[Link to Grafana/DataDog]*
- **Runbooks:** *[Link to operational procedures]*
- **Cost Dashboard:** *[Link to cost monitoring]*
- **Security Reports:** *[Link to security scan results]*

---

**Last Updated:** *[Date]* | **Next Review:** *[Monthly ops review]*
