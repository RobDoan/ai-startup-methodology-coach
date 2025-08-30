# DevOps Design: *[Feature Name]*

**Parent Design:** [../design.md](../design.md)  
**Parent Requirements:** [../requirements.md](../requirements.md)  
**Tasks:** [./tasks.md](./tasks.md)  
**Test Plan:** [./test-plan.md](./test-plan.md)  

---

## Why

*Infrastructure design rationale and operational philosophy*

### Infrastructure Goals
>
> **What are we optimizing for in our infrastructure?**

1. **Reliability:** 99.9% uptime with graceful degradation patterns
2. **Scalability:** Handle 10x traffic spikes without manual intervention
3. **Security:** Zero-trust architecture with defense-in-depth
4. **Observability:** Complete visibility into system behavior
5. **Cost Efficiency:** Right-sized resources with automatic optimization
6. **Developer Experience:** Self-service capabilities and fast feedback loops

### Architectural Principles

- **Infrastructure as Code:** Everything version-controlled and reproducible
- **Immutable Infrastructure:** Replace, don't modify
- **Microservices-Ready:** Designed for independent service deployment
- **Cloud-Native:** Leverage managed services where possible
- **Event-Driven:** Reactive architecture for better resilience
- **GitOps:** Configuration changes through version control

### Technology Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| **Container Orchestration** | Kubernetes (EKS) | Industry standard, rich ecosystem | Complexity overhead |
| **Service Mesh** | Istio | Traffic management, security | Learning curve, resource overhead |
| **Monitoring** | Prometheus + Grafana | Open source, Kubernetes native | Operational complexity |
| **Logging** | ELK Stack | Centralized logging, powerful search | Resource intensive |
| **CI/CD** | GitLab CI/ArgoCD | GitOps workflow, declarative deployments | Tool complexity |
| **Cloud Provider** | AWS | Team expertise, service breadth | Vendor lock-in |

---

## What

*Infrastructure architecture and components*

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Internet / CDN                           │
└─────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────┐
│                 Edge/Security Layer                        │
│          WAF + DDoS Protection + Rate Limiting           │
└─────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────┐
│                 Load Balancer Layer                        │
│           ALB + NLB (Multi-AZ, Auto-scaling)             │
└─────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────┐
│                Kubernetes Cluster                         │
│     ┌──────────────┐     ┌──────────────┐     │
│     │ Feature API    │     │   Istio       │     │
│     │ (3 replicas)   │     │ Service Mesh │     │
│     └──────────────┘     └──────────────┘     │
└─────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────┐
│                    Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ RDS PostgreSQL │  │ ElastiCache  │  │ S3 Bucket │  │
│  │ (Multi-AZ)     │  │ Redis        │  │ (Backups) │  │
│  └──────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────┘

                    Cross-Cutting Concerns:
              ┌─────────────────────────────────┐
              │ Monitoring: Prometheus + Grafana  │
              │ Logging: ELK Stack             │
              │ Tracing: Jaeger                │
              │ Secrets: Kubernetes Secrets    │
              │ Backup: Velero + S3            │
              └─────────────────────────────────┘
```

### Environment Architecture

#### Production Environment

```yaml
production:
  regions:
    primary: us-east-1
    secondary: us-west-2
  
  kubernetes:
    cluster_version: "1.28"
    node_groups:
      - name: "app-nodes"
        instance_type: "m5.xlarge"
        min_size: 3
        max_size: 10
        desired_capacity: 3
      - name: "monitoring-nodes"
        instance_type: "m5.large"
        min_size: 2
        max_size: 4
        desired_capacity: 2
        taints:
          - key: "monitoring"
            value: "true"
            effect: "NoSchedule"
  
  database:
    engine: "postgres"
    version: "15.4"
    instance_class: "db.r5.xlarge"
    multi_az: true
    backup_retention: 30
    storage_encrypted: true
    
  cache:
    engine: "redis"
    version: "7.0"
    node_type: "cache.r5.large"
    num_cache_clusters: 3
    automatic_failover: true
```

#### Staging Environment

```yaml
staging:
  regions:
    primary: us-east-1
  
  kubernetes:
    cluster_version: "1.28"
    node_groups:
      - name: "app-nodes"
        instance_type: "m5.large"
        min_size: 2
        max_size: 4
        desired_capacity: 2
  
  database:
    engine: "postgres"
    version: "15.4"
    instance_class: "db.t3.large"
    multi_az: false
    backup_retention: 7
    storage_encrypted: true
    
  cache:
    engine: "redis"
    version: "7.0"
    node_type: "cache.t3.medium"
    num_cache_clusters: 1
```

### Network Architecture

#### VPC Design

```yaml
vpc:
  cidr: "10.0.0.0/16"
  enable_dns_hostnames: true
  enable_dns_support: true
  
  subnets:
    public:
      - cidr: "10.0.1.0/24"
        availability_zone: "us-east-1a"
      - cidr: "10.0.2.0/24"
        availability_zone: "us-east-1b"
      - cidr: "10.0.3.0/24"
        availability_zone: "us-east-1c"
    
    private:
      - cidr: "10.0.10.0/24"
        availability_zone: "us-east-1a"
      - cidr: "10.0.20.0/24"
        availability_zone: "us-east-1b"
      - cidr: "10.0.30.0/24"
        availability_zone: "us-east-1c"
    
    database:
      - cidr: "10.0.100.0/24"
        availability_zone: "us-east-1a"
      - cidr: "10.0.200.0/24"
        availability_zone: "us-east-1b"
      - cidr: "10.0.300.0/24"
        availability_zone: "us-east-1c"
```

### Security Architecture

#### Identity and Access Management

```yaml
iam_roles:
  cluster_service_role:
    name: "eks-cluster-service-role"
    policies:
      - "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  
  node_instance_role:
    name: "eks-node-instance-role"
    policies:
      - "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
      - "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
      - "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  
  pod_execution_role:
    name: "feature-api-pod-role"
    policies:
      - "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
    inline_policies:
      secrets_access:
        effect: "Allow"
        actions:
          - "secretsmanager:GetSecretValue"
        resources:
          - "arn:aws:secretsmanager:*:*:secret:feature-api/*"
```

#### Network Security

```yaml
security_groups:
  alb_sg:
    name: "feature-alb-sg"
    ingress:
      - protocol: "tcp"
        from_port: 80
        to_port: 80
        cidr_blocks: ["0.0.0.0/0"]
      - protocol: "tcp"
        from_port: 443
        to_port: 443
        cidr_blocks: ["0.0.0.0/0"]
    egress:
      - protocol: "tcp"
        from_port: 30000
        to_port: 32767
        security_groups: ["${aws_security_group.node_sg.id}"]
  
  node_sg:
    name: "feature-node-sg"
    ingress:
      - protocol: "tcp"
        from_port: 30000
        to_port: 32767
        security_groups: ["${aws_security_group.alb_sg.id}"]
      - protocol: "tcp"
        from_port: 443
        to_port: 443
        security_groups: ["${aws_security_group.cluster_sg.id}"]
    egress:
      - protocol: "all"
        cidr_blocks: ["0.0.0.0/0"]
  
  rds_sg:
    name: "feature-rds-sg"
    ingress:
      - protocol: "tcp"
        from_port: 5432
        to_port: 5432
        security_groups: ["${aws_security_group.node_sg.id}"]
```

---

## How

*Implementation approach and deployment patterns*

### Infrastructure as Code

#### Terraform Structure

```
infrastructure/
├── environments/
│   ├── staging/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   └── production/
│       ├── main.tf
│       ├── variables.tf
│       └── terraform.tfvars
├── modules/
│   ├── eks/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── rds/
│   ├── elasticache/
│   └── monitoring/
└── shared/
    ├── backend.tf
    ├── providers.tf
    └── versions.tf
```

#### EKS Cluster Module

```hcl
# modules/eks/main.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = var.cluster_name
  cluster_version = var.kubernetes_version

  vpc_id                         = var.vpc_id
  subnet_ids                     = var.private_subnet_ids
  cluster_endpoint_public_access = var.cluster_endpoint_public_access

  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  eks_managed_node_groups = {
    application = {
      min_size     = var.node_group_min_size
      max_size     = var.node_group_max_size
      desired_size = var.node_group_desired_size

      instance_types = var.node_instance_types
      capacity_type  = "ON_DEMAND"

      k8s_labels = {
        Environment = var.environment
        NodeGroup   = "application"
      }

      update_config = {
        max_unavailable_percentage = 33
      }
    }

    monitoring = {
      min_size     = 2
      max_size     = 4
      desired_size = 2

      instance_types = ["m5.large"]
      capacity_type  = "ON_DEMAND"

      k8s_labels = {
        Environment = var.environment
        NodeGroup   = "monitoring"
      }

      taints = {
        monitoring = {
          key    = "monitoring"
          value  = "true"
          effect = "NO_SCHEDULE"
        }
      }
    }
  }

  tags = var.tags
}
```

### Kubernetes Manifests

#### Application Deployment

```yaml
# k8s/deployments/feature-api.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: feature-api
  namespace: default
  labels:
    app: feature-api
    version: "{{ .Values.image.tag }}"
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: feature-api
  template:
    metadata:
      labels:
        app: feature-api
        version: "{{ .Values.image.tag }}"
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: feature-api
      containers:
      - name: feature-api
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - name: http
          containerPort: 3000
          protocol: TCP
        env:
        - name: NODE_ENV
          value: {{ .Values.environment }}
        - name: PORT
          value: "3000"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: feature-api-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: feature-api-secrets
              key: redis-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: feature-api-secrets
              key: jwt-secret
        resources:
          limits:
            cpu: {{ .Values.resources.limits.cpu }}
            memory: {{ .Values.resources.limits.memory }}
          requests:
            cpu: {{ .Values.resources.requests.cpu }}
            memory: {{ .Values.resources.requests.memory }}
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health/ready
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        securityContext:
          allowPrivilegeEscalation: false
          runAsNonRoot: true
          runAsUser: 1001
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
```

#### Service Definition

```yaml
# k8s/services/feature-api.yml
apiVersion: v1
kind: Service
metadata:
  name: feature-api
  namespace: default
  labels:
    app: feature-api
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: http
    protocol: TCP
    name: http
  selector:
    app: feature-api
```

#### Horizontal Pod Autoscaler

```yaml
# k8s/autoscaling/hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: feature-api-hpa
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: feature-api
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: {{ .Values.autoscaling.targetMemoryUtilizationPercentage }}
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: 2
        periodSeconds: 60
```

### CI/CD Pipeline

#### GitLab CI Configuration

```yaml
# .gitlab-ci.yml
stages:
  - validate
  - build
  - test
  - security
  - deploy
  - verify

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"
  HELM_CHART_VERSION: "1.0.0"

# Infrastructure validation
terraform:validate:
  stage: validate
  image: hashicorp/terraform:1.6
  script:
    - cd infrastructure
    - terraform init -backend=false
    - terraform validate
    - terraform fmt -check
  rules:
    - changes:
        - "infrastructure/**/*"

# Application build
build:application:
  stage: build
  image: docker:24-dind
  services:
    - docker:24-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_BRANCH == "develop"'

# Security scanning
security:container:
  stage: security
  image: aquasecurity/trivy:latest
  script:
    - trivy image --exit-code 1 --severity HIGH,CRITICAL $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  allow_failure: false
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_BRANCH == "develop"'

security:infrastructure:
  stage: security
  image: bridgecrew/checkov:latest
  script:
    - checkov -d infrastructure/ --framework terraform --check CKV_AWS_*
  allow_failure: false
  rules:
    - changes:
        - "infrastructure/**/*"

# Deployment to staging
deploy:staging:
  stage: deploy
  image: alpine/helm:latest
  environment:
    name: staging
    url: https://api-staging.example.com
  script:
    - kubectl config use-context staging
    - helm upgrade --install feature-api ./helm-chart \
        --namespace default \
        --set image.tag=$CI_COMMIT_SHA \
        --set environment=staging \
        --values ./helm-chart/values-staging.yaml
  rules:
    - if: '$CI_COMMIT_BRANCH == "develop"'

# Deployment to production
deploy:production:
  stage: deploy
  image: alpine/helm:latest
  environment:
    name: production
    url: https://api.example.com
  script:
    - kubectl config use-context production
    - helm upgrade --install feature-api ./helm-chart \
        --namespace default \
        --set image.tag=$CI_COMMIT_SHA \
        --set environment=production \
        --values ./helm-chart/values-production.yaml
  when: manual
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

# Post-deployment verification
verify:staging:
  stage: verify
  image: curlimages/curl:latest
  script:
    - curl -f https://api-staging.example.com/health || exit 1
    - curl -f https://api-staging.example.com/health/ready || exit 1
  rules:
    - if: '$CI_COMMIT_BRANCH == "develop"'

verify:production:
  stage: verify
  image: curlimages/curl:latest
  script:
    - curl -f https://api.example.com/health || exit 1
    - curl -f https://api.example.com/health/ready || exit 1
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      when: manual
```

### Monitoring Configuration

#### Prometheus Configuration

```yaml
# monitoring/prometheus/values.yml
prometheus:
  prometheusSpec:
    retention: 30d
    resources:
      requests:
        memory: "2Gi"
        cpu: "1000m"
      limits:
        memory: "4Gi"
        cpu: "2000m"
    
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 50Gi
    
    additionalScrapeConfigs:
      - job_name: 'feature-api'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
            action: replace
            target_label: __metrics_path__
            regex: (.+)
          - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
            action: replace
            regex: ([^:]+)(?::\d+)?;(\d+)
            replacement: $1:$2
            target_label: __address__
          - action: labelmap
            regex: __meta_kubernetes_pod_label_(.+)
          - source_labels: [__meta_kubernetes_namespace]
            action: replace
            target_label: kubernetes_namespace
          - source_labels: [__meta_kubernetes_pod_name]
            action: replace
            target_label: kubernetes_pod_name
```

#### Grafana Dashboards

```json
{
  "dashboard": {
    "id": null,
    "title": "Feature API - Application Metrics",
    "panels": [
      {
        "id": 1,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{job=\"feature-api\"}[5m])",
            "legendFormat": "{{method}} {{status_code}}"
          }
        ]
      },
      {
        "id": 2,
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job=\"feature-api\"}[5m]))",
            "legendFormat": "P95"
          },
          {
            "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket{job=\"feature-api\"}[5m]))",
            "legendFormat": "P99"
          }
        ]
      },
      {
        "id": 3,
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{job=\"feature-api\", status_code=~\"5..\"}[5m]) / rate(http_requests_total{job=\"feature-api\"}[5m])",
            "legendFormat": "Error Rate"
          }
        ]
      }
    ]
  }
}
```

### Disaster Recovery

#### Backup Strategy

```yaml
# backup/velero-config.yml
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: daily-backup
  namespace: velero
spec:
  schedule: "0 2 * * *"
  template:
    includedNamespaces:
    - default
    - monitoring
    excludedResources:
    - events
    - events.events.k8s.io
    storageLocation: aws-s3
    ttl: 720h0m0s
    hooks:
      resources:
      - name: postgres-backup
        includedNamespaces:
        - default
        labelSelector:
          matchLabels:
            app: postgresql
        pre:
        - exec:
            container: postgresql
            command:
            - /bin/bash
            - -c
            - 'pg_dump $DATABASE_URL > /tmp/backup.sql'
        post:
        - exec:
            container: postgresql
            command:
            - /bin/bash
            - -c
            - 'rm -f /tmp/backup.sql'
```

#### Database Backup Automation

```bash
#!/bin/bash
# scripts/database-backup.sh

set -e

# Configuration
DB_HOST=${DB_HOST:-"production-db.cluster-xxx.us-east-1.rds.amazonaws.com"}
DB_NAME=${DB_NAME:-"features"}
DB_USER=${DB_USER:-"backup_user"}
S3_BUCKET=${S3_BUCKET:-"feature-api-backups"}
RETENTION_DAYS=${RETENTION_DAYS:-30}

# Create backup
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="feature_api_${TIMESTAMP}.sql"

echo "Starting database backup..."
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME --verbose > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE
BACKUP_FILE="${BACKUP_FILE}.gz"

# Upload to S3
aws s3 cp $BACKUP_FILE s3://$S3_BUCKET/database-backups/

# Clean up local file
rm $BACKUP_FILE

# Clean up old backups
echo "Cleaning up old backups..."
aws s3 ls s3://$S3_BUCKET/database-backups/ | \
    awk '{print $4}' | \
    sort -r | \
    tail -n +$((RETENTION_DAYS + 1)) | \
    xargs -I {} aws s3 rm s3://$S3_BUCKET/database-backups/{}

echo "Database backup completed successfully"
```

---

## Cost Optimization

### Resource Right-sizing

#### Cost Analysis

| Resource Category | Current Monthly Cost | Optimized Cost | Savings |
|------------------|---------------------|----------------|----------|
| **EKS Cluster** | $73 | $73 | $0 |
| **Worker Nodes** | $500 | $350 | $150 |
| **RDS Database** | $400 | $300 | $100 |
| **ElastiCache** | $200 | $120 | $80 |
| **Load Balancers** | $50 | $40 | $10 |
| **Data Transfer** | $75 | $60 | $15 |
| **Storage** | $100 | $80 | $20 |
| **Monitoring** | $150 | $150 | $0 |
| **Total** | **$1,548** | **$1,173** | **$375** |

#### Optimization Strategies

```yaml
# cost-optimization/spot-instances.yml
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: spot-node-pool
spec:
  template:
    metadata:
      labels:
        provisioner: spot
    spec:
      requirements:
        - key: "karpenter.sh/capacity-type"
          operator: In
          values: ["spot"]
        - key: "node.kubernetes.io/instance-type"
          operator: In
          values: ["m5.large", "m5.xlarge", "m4.large", "m4.xlarge"]
      nodeClassRef:
        name: default
      taints:
        - key: spot-instance
          value: "true"
          effect: NoSchedule
  disruption:
    consolidationPolicy: WhenUnderutilized
    consolidateAfter: 30s
  limits:
    cpu: 1000
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: cost-monitoring
data:
  budget_alert_threshold: "1200"  # $1200/month
  cost_anomaly_threshold: "20"    # 20% increase
  optimization_schedule: "0 6 * * 1"  # Weekly on Monday 6 AM
```

---

## Our Philosophy
>
> *"Infrastructure as Code: Everything should be version-controlled and reproducible."*

**DevOps Principles:**

- **Automate Everything:** Manual processes don't scale and introduce errors
- **Security by Default:** Build security into every layer from day one
- **Observability First:** You can't operate what you can't see
- **Immutable Infrastructure:** Replace, don't modify
- **Cost Conscious:** Optimize for efficiency without sacrificing reliability

---

## Compliance & Governance

### Compliance Requirements

| Requirement | Implementation | Validation |
|-------------|---------------|-----------|
| **Data Encryption** | TLS 1.3, AES-256 at rest | Automated scanning |
| **Access Logging** | All API calls logged | CloudTrail + ELK |
| **Backup Retention** | 30 days minimum | Automated testing |
| **Incident Response** | <4 hour response time | Runbook testing |
| **Change Management** | All changes via GitOps | Audit trail |
| **Vulnerability Management** | Weekly security scans | Automated remediation |

### Governance Automation

```yaml
# governance/policy-as-code.yml
apiVersion: config.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: requiresecuritycontext
spec:
  crd:
    spec:
      names:
        kind: RequireSecurityContext
      validation:
        openAPIV3Schema:
          type: object
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package requiresecuritycontext
        
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          not container.securityContext.runAsNonRoot
          msg := "Container must run as non-root user"
        }
---
apiVersion: templates.gatekeeper.sh/v1beta1
kind: RequireSecurityContext
metadata:
  name: must-run-as-non-root
spec:
  match:
    - apiGroups: ["apps"]
      kinds: ["Deployment"]
```

---

**Links:**

- **Infrastructure Repository:** *[Link to Terraform code]*
- **Kubernetes Manifests:** *[Link to K8s configuration]*
- **Monitoring Dashboards:** *[Link to Grafana]*
- **Cost Dashboard:** *[Link to cost analysis]*
- **Runbooks:** *[Link to operational procedures]*
- **Architecture Diagrams:** *[Link to detailed diagrams]*

---

**Last Updated:** *[Date]* | **Next Review:** *[Quarterly architecture review]*
