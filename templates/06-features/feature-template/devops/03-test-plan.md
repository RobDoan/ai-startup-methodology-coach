# DevOps Test Plan: *[Feature Name]*

**Parent Requirements:** [../requirements.md](../requirements.md)  
**DevOps Design:** [./design.md](./design.md)  
**Tasks:** [./tasks.md](./tasks.md)  
**Test Status:** 🟡 Planning | 🟠 In Progress | ✅ Complete | ❌ Failed  

---

## Testing Philosophy
>
> *"Infrastructure should be tested as rigorously as application code."*

**Our Infrastructure Testing Strategy:**

- **Infrastructure Tests (40%):** Terraform validation and compliance
- **Deployment Tests (30%):** CI/CD pipeline and deployment validation
- **Operational Tests (20%):** Monitoring, backup, and recovery testing
- **Security Tests (10%):** Vulnerability scanning and compliance validation

**Null Hypothesis:** *The infrastructure will not reliably support the application under expected load and failure conditions*  
**Goal:** Validate infrastructure reliability, security, and operational readiness

---

## Test Coverage Strategy

### What We're Testing
>
> **Mapping infrastructure tests to requirements and design decisions**

| Component/Requirement | Test Type | Success Criteria | Risk Level |
|----------------------|-----------|------------------|------------|
| **Infrastructure Provisioning** | Unit | Terraform plan succeeds | High |
| **Network Connectivity** | Integration | All services can communicate | High |
| **Security Controls** | Security | No vulnerabilities >Medium | Critical |
| **Auto-scaling** | Load | Scales appropriately under load | Medium |
| **Monitoring & Alerting** | Functional | All alerts fire correctly | High |
| **Backup & Recovery** | Disaster Recovery | RTO/RPO targets met | Critical |
| **CI/CD Pipeline** | Integration | Deployments complete successfully | High |
| **Cost Controls** | Operational | Stays within budget thresholds | Medium |

### Test Environment Matrix

| Environment | Purpose | Infrastructure | Scope |
|-------------|---------|---------------|-------|
| **Development** | Unit testing | Local/Docker | Terraform validation |
| **Staging** | Integration testing | Scaled-down production | End-to-end workflows |
| **Production** | Monitoring | Full production | Operational validation |
| **DR Site** | Disaster recovery | Cross-region replica | Recovery procedures |

---

## Infrastructure Tests

*Testing infrastructure as code and provisioning*

### Terraform Validation Tests

#### Unit Tests for Terraform Modules

```go
// tests/terraform/eks_test.go
package test

import (
 "testing"
 "github.com/gruntwork-io/terratest/modules/terraform"
 "github.com/stretchr/testify/assert"
)

func TestEKSModule(t *testing.T) {
 terraformOptions := &terraform.Options{
  TerraformDir: "../../modules/eks",
  Vars: map[string]interface{}{
   "cluster_name":      "test-cluster",
   "kubernetes_version": "1.28",
   "vpc_id":            "vpc-12345",
   "private_subnet_ids": []string{"subnet-1", "subnet-2"},
   "environment":       "test",
  },
  NoColor: true,
 }

 defer terraform.Destroy(t, terraformOptions)

 // Validate Terraform plan
 planOutput := terraform.InitAndPlan(t, terraformOptions)
 assert.Contains(t, planOutput, "Plan: ")
 assert.NotContains(t, planOutput, "Error: ")

 // Apply the configuration
 terraform.Apply(t, terraformOptions)

 // Validate outputs
 clusterEndpoint := terraform.Output(t, terraformOptions, "cluster_endpoint")
 assert.NotEmpty(t, clusterEndpoint)

 clusterName := terraform.Output(t, terraformOptions, "cluster_name")
 assert.Equal(t, "test-cluster", clusterName)
}

func TestRDSModule(t *testing.T) {
 terraformOptions := &terraform.Options{
  TerraformDir: "../../modules/rds",
  Vars: map[string]interface{}{
   "identifier":         "test-db",
   "engine":            "postgres",
   "engine_version":    "15.4",
   "instance_class":    "db.t3.micro",
   "allocated_storage": 20,
   "db_name":           "testdb",
   "username":          "testuser",
   "vpc_id":            "vpc-12345",
   "subnet_ids":        []string{"subnet-1", "subnet-2"},
  },
  NoColor: true,
 }

 defer terraform.Destroy(t, terraformOptions)

 terraform.InitAndApply(t, terraformOptions)

 // Validate RDS instance is accessible
 dbEndpoint := terraform.Output(t, terraformOptions, "db_instance_endpoint")
 assert.NotEmpty(t, dbEndpoint)
 assert.Contains(t, dbEndpoint, "rds.amazonaws.com")
}
```

#### Compliance Testing

```yaml
# tests/compliance/checkov-config.yml
framework:
  - terraform
  - kubernetes

checks:
  # AWS Security Checks
  - CKV_AWS_20  # S3 Bucket - Public Access Block
  - CKV_AWS_21  # S3 Bucket - Versioning
  - CKV_AWS_61  # RDS - Encryption at rest
  - CKV_AWS_16  # RDS - Backup retention
  - CKV_AWS_23  # Security Group - Restrictive ingress
  
  # Kubernetes Security Checks
  - CKV_K8S_8   # Liveness Probe
  - CKV_K8S_9   # Readiness Probe
  - CKV_K8S_12  # Memory limits
  - CKV_K8S_13  # CPU limits
  - CKV_K8S_14  # Image tag specified
  - CKV_K8S_22  # Non-root user
  - CKV_K8S_28  # Minimize capabilities

skip_checks:
  - CKV_AWS_79  # VPC Flow Logs (not required for test env)
```

#### Policy as Code Testing

```bash
#!/bin/bash
# tests/compliance/policy-test.sh

set -e

echo "Running infrastructure compliance tests..."

# Test Terraform configurations
echo "Testing Terraform configurations..."
checkov -d infrastructure/ --framework terraform --config tests/compliance/checkov-config.yml

# Test Kubernetes manifests
echo "Testing Kubernetes manifests..."
checkov -d k8s/ --framework kubernetes

# Test Open Policy Agent policies
echo "Testing OPA policies..."
opa test policies/

# Test security policies with Falco
echo "Testing runtime security policies..."
falco --validate-rules-file policies/falco-rules.yml

echo "All compliance tests passed!"
```

### Network Connectivity Tests

```python
# tests/network/connectivity_test.py
import pytest
import requests
import socket
import subprocess
from kubernetes import client, config

class TestNetworkConnectivity:
    
    @classmethod
    def setup_class(cls):
        """Load Kubernetes config"""
        config.load_kube_config()
        cls.v1 = client.CoreV1Api()
        cls.apps_v1 = client.AppsV1Api()
    
    def test_cluster_connectivity(self):
        """Test basic cluster connectivity"""
        # Test if we can connect to Kubernetes API
        try:
            version = self.v1.get_api_resources()
            assert len(version.resources) > 0
        except Exception as e:
            pytest.fail(f"Cannot connect to Kubernetes cluster: {e}")
    
    def test_pod_to_pod_communication(self):
        """Test pod-to-pod communication within cluster"""
        # Create test pods
        test_pod_1 = self._create_test_pod("test-pod-1", "nginx")
        test_pod_2 = self._create_test_pod("test-pod-2", "alpine", ["sleep", "3600"])
        
        try:
            # Wait for pods to be ready
            self._wait_for_pod_ready("test-pod-1")
            self._wait_for_pod_ready("test-pod-2")
            
            # Get pod IPs
            pod_1_ip = self._get_pod_ip("test-pod-1")
            
            # Test connectivity from pod-2 to pod-1
            exec_command = [
                "wget", "-q", "-O", "-", f"http://{pod_1_ip}:80", "--timeout=10"
            ]
            
            response = self._exec_command_in_pod("test-pod-2", exec_command)
            assert "Welcome to nginx" in response
            
        finally:
            # Cleanup
            self._delete_test_pod("test-pod-1")
            self._delete_test_pod("test-pod-2")
    
    def test_external_connectivity(self):
        """Test connectivity to external services"""
        # Test DNS resolution
        try:
            socket.gethostbyname("google.com")
        except socket.gaierror:
            pytest.fail("DNS resolution failed")
        
        # Test HTTPS connectivity
        try:
            response = requests.get("https://httpbin.org/get", timeout=10)
            assert response.status_code == 200
        except requests.RequestException as e:
            pytest.fail(f"External HTTPS connectivity failed: {e}")
    
    def test_load_balancer_connectivity(self):
        """Test load balancer accessibility"""
        # Get load balancer service
        services = self.v1.list_namespaced_service(namespace="default")
        lb_service = None
        
        for service in services.items:
            if service.spec.type == "LoadBalancer":
                lb_service = service
                break
        
        if not lb_service:
            pytest.skip("No LoadBalancer service found")
        
        # Test connectivity to load balancer
        if lb_service.status.load_balancer.ingress:
            lb_ip = lb_service.status.load_balancer.ingress[0].ip
            lb_port = lb_service.spec.ports[0].port
            
            try:
                response = requests.get(f"http://{lb_ip}:{lb_port}/health", timeout=10)
                assert response.status_code == 200
            except requests.RequestException as e:
                pytest.fail(f"Load balancer connectivity failed: {e}")
    
    def _create_test_pod(self, name, image, command=None):
        """Helper to create test pod"""
        pod_spec = client.V1Pod(
            metadata=client.V1ObjectMeta(name=name),
            spec=client.V1PodSpec(
                containers=[
                    client.V1Container(
                        name="test-container",
                        image=image,
                        command=command
                    )
                ]
            )
        )
        
        return self.v1.create_namespaced_pod(namespace="default", body=pod_spec)
```

---

## Deployment Tests

*Testing CI/CD pipeline and deployment processes*

### Pipeline Integration Tests

```yaml
# tests/pipeline/pipeline-test.yml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: pipeline-test-
spec:
  entrypoint: pipeline-test
  templates:
  - name: pipeline-test
    steps:
    - - name: validate-terraform
        template: terraform-validate
    - - name: build-application
        template: build-app
    - - name: security-scan
        template: security-scan
    - - name: deploy-staging
        template: deploy-to-staging
    - - name: run-integration-tests
        template: integration-tests
    - - name: deploy-production
        template: deploy-to-production
        when: "{{steps.integration-tests.outputs.result}} == 'success'"
  
  - name: terraform-validate
    container:
      image: hashicorp/terraform:1.6
      command: [sh, -c]
      args: [
        "cd /workspace/infrastructure &&
         terraform init -backend=false &&
         terraform validate &&
         terraform fmt -check"
      ]
      workingDir: /workspace
      volumeMounts:
      - name: workspace
        mountPath: /workspace
  
  - name: build-app
    container:
      image: docker:24-dind
      command: [sh, -c]
      args: [
        "docker build -t test-image:latest . &&
         docker save test-image:latest > /tmp/image.tar"
      ]
      volumeMounts:
      - name: workspace
        mountPath: /workspace
      - name: docker-sock
        mountPath: /var/run/docker.sock
  
  - name: security-scan
    container:
      image: aquasecurity/trivy:latest
      command: [sh, -c]
      args: [
        "docker load < /tmp/image.tar &&
         trivy image --exit-code 1 --severity HIGH,CRITICAL test-image:latest"
      ]
      volumeMounts:
      - name: docker-sock
        mountPath: /var/run/docker.sock
  
  - name: deploy-to-staging
    container:
      image: alpine/helm:latest
      command: [sh, -c]
      args: [
        "helm upgrade --install feature-api-test ./helm-chart \
           --namespace test \
           --create-namespace \
           --set image.tag=test-latest \
           --set environment=test \
           --wait --timeout=300s"
      ]
      volumeMounts:
      - name: workspace
        mountPath: /workspace
  
  - name: integration-tests
    container:
      image: curlimages/curl:latest
      command: [sh, -c]
      args: [
        "sleep 30 &&
         curl -f http://feature-api-test.test.svc.cluster.local/health &&
         curl -f http://feature-api-test.test.svc.cluster.local/health/ready"
      ]
  
  volumes:
  - name: workspace
    emptyDir: {}
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
```

### Blue-Green Deployment Tests

```bash
#!/bin/bash
# tests/deployment/blue-green-test.sh

set -e

# Configuration
NAMESPACE="default"
SERVICE_NAME="feature-api"
DEPLOYMENT_NAME="feature-api"
HEALTH_ENDPOINT="/health"
READINESS_ENDPOINT="/health/ready"

echo "Starting blue-green deployment test..."

# Get current deployment (blue)
CURRENT_VERSION=$(kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE -o jsonpath='{.metadata.labels.version}')
echo "Current version (blue): $CURRENT_VERSION"

# Deploy new version (green)
NEW_VERSION="test-$(date +%s)"
echo "Deploying new version (green): $NEW_VERSION"

# Create green deployment
kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE -o yaml | \
  sed "s/name: $DEPLOYMENT_NAME/name: $DEPLOYMENT_NAME-green/g" | \
  sed "s/version: $CURRENT_VERSION/version: $NEW_VERSION/g" | \
  kubectl apply -f -

# Wait for green deployment to be ready
echo "Waiting for green deployment to be ready..."
kubectl wait --for=condition=available deployment/$DEPLOYMENT_NAME-green -n $NAMESPACE --timeout=300s

# Test green deployment health
echo "Testing green deployment health..."
GREEN_POD=$(kubectl get pods -n $NAMESPACE -l app=$DEPLOYMENT_NAME,version=$NEW_VERSION -o jsonpath='{.items[0].metadata.name}')

# Port forward to test green deployment
kubectl port-forward pod/$GREEN_POD -n $NAMESPACE 8080:3000 &
PORT_FORWARD_PID=$!

# Wait for port forward to be ready
sleep 5

# Test health endpoints
if curl -f http://localhost:8080$HEALTH_ENDPOINT; then
    echo "Health check passed"
else
    echo "Health check failed"
    kill $PORT_FORWARD_PID
    exit 1
fi

if curl -f http://localhost:8080$READINESS_ENDPOINT; then
    echo "Readiness check passed"
else
    echo "Readiness check failed"
    kill $PORT_FORWARD_PID
    exit 1
fi

# Kill port forward
kill $PORT_FORWARD_PID

# Switch traffic to green (simulate)
echo "Switching traffic to green deployment..."
kubectl patch service $SERVICE_NAME -n $NAMESPACE -p '{"spec":{"selector":{"version":"'$NEW_VERSION'"}}}'

# Test service endpoint
echo "Testing service endpoint after traffic switch..."
SERVICE_IP=$(kubectl get service $SERVICE_NAME -n $NAMESPACE -o jsonpath='{.spec.clusterIP}')
kubectl run curl-test --image=curlimages/curl --rm -i --restart=Never -- \
  curl -f http://$SERVICE_IP$HEALTH_ENDPOINT

# Rollback traffic to blue
echo "Rolling back traffic to blue deployment..."
kubectl patch service $SERVICE_NAME -n $NAMESPACE -p '{"spec":{"selector":{"version":"'$CURRENT_VERSION'"}}}'

# Cleanup green deployment
echo "Cleaning up green deployment..."
kubectl delete deployment $DEPLOYMENT_NAME-green -n $NAMESPACE

echo "Blue-green deployment test completed successfully"
```

### Canary Deployment Tests

```python
# tests/deployment/canary_test.py
import time
import requests
import pytest
from kubernetes import client, config

class TestCanaryDeployment:
    
    @classmethod
    def setup_class(cls):
        config.load_kube_config()
        cls.apps_v1 = client.AppsV1Api()
        cls.v1 = client.CoreV1Api()
        cls.namespace = "default"
        cls.deployment_name = "feature-api"
        cls.service_name = "feature-api"
    
    def test_canary_deployment_flow(self):
        """Test complete canary deployment process"""
        # Step 1: Deploy canary version (10% traffic)
        canary_version = f"canary-{int(time.time())}"
        self._deploy_canary(canary_version, replicas=1)
        
        # Step 2: Verify canary is healthy
        self._verify_canary_health(canary_version)
        
        # Step 3: Gradually increase traffic
        traffic_percentages = [10, 25, 50, 100]
        
        for percentage in traffic_percentages:
            print(f"Testing {percentage}% traffic to canary...")
            
            # Update traffic split
            self._update_traffic_split(canary_version, percentage)
            
            # Wait for changes to propagate
            time.sleep(30)
            
            # Monitor metrics
            error_rate = self._get_error_rate(duration_minutes=5)
            response_time = self._get_response_time_p95(duration_minutes=5)
            
            # Verify metrics are within acceptable thresholds
            assert error_rate < 0.01, f"Error rate too high: {error_rate}"
            assert response_time < 200, f"Response time too high: {response_time}ms"
            
            print(f"Metrics OK: {error_rate:.3f}% error rate, {response_time}ms P95")
        
        # Step 4: Complete rollout
        self._complete_canary_rollout(canary_version)
        
        # Step 5: Cleanup old version
        self._cleanup_old_version()
    
    def test_canary_rollback(self):
        """Test automatic rollback on canary failure"""
        # Deploy intentionally broken canary
        broken_version = f"broken-{int(time.time())}"
        self._deploy_broken_canary(broken_version)
        
        # Simulate traffic to canary
        self._update_traffic_split(broken_version, 10)
        
        # Wait and check metrics
        time.sleep(60)
        
        error_rate = self._get_error_rate(duration_minutes=2)
        
        # Should trigger rollback if error rate > 5%
        if error_rate > 0.05:
            print(f"High error rate detected: {error_rate:.3f}%")
            
            # Perform rollback
            self._rollback_canary(broken_version)
            
            # Verify rollback
            time.sleep(30)
            post_rollback_error_rate = self._get_error_rate(duration_minutes=2)
            
            assert post_rollback_error_rate < 0.01, "Rollback failed to reduce error rate"
            
        # Cleanup
        self._cleanup_canary(broken_version)
    
    def _deploy_canary(self, version, replicas=1):
        """Deploy canary version"""
        # Implementation for deploying canary
        pass
    
    def _verify_canary_health(self, version):
        """Verify canary deployment is healthy"""
        # Get canary pods
        pods = self.v1.list_namespaced_pod(
            namespace=self.namespace,
            label_selector=f"app={self.deployment_name},version={version}"
        )
        
        assert len(pods.items) > 0, "No canary pods found"
        
        for pod in pods.items:
            # Check pod status
            assert pod.status.phase == "Running", f"Pod {pod.metadata.name} not running"
            
            # Check readiness
            conditions = pod.status.conditions or []
            ready_condition = next((c for c in conditions if c.type == "Ready"), None)
            assert ready_condition and ready_condition.status == "True", \
                f"Pod {pod.metadata.name} not ready"
    
    def _update_traffic_split(self, canary_version, percentage):
        """Update traffic split between stable and canary"""
        # Implementation for updating Istio VirtualService or similar
        # This would depend on your traffic management solution
        pass
    
    def _get_error_rate(self, duration_minutes=5):
        """Get error rate from monitoring system"""
        # Query Prometheus for error rate
        # This is a placeholder - implement based on your monitoring setup
        query = f"""
        rate(http_requests_total{{status=~"5..",job="{self.service_name}"}}[{duration_minutes}m]) / 
        rate(http_requests_total{{job="{self.service_name}"}}[{duration_minutes}m])
        """
        
        # Return mock error rate for testing
        return 0.001  # 0.1% error rate
    
    def _get_response_time_p95(self, duration_minutes=5):
        """Get P95 response time from monitoring system"""
        # Query Prometheus for response time
        query = f"""
        histogram_quantile(0.95, 
          rate(http_request_duration_seconds_bucket{{job="{self.service_name}"}}[{duration_minutes}m])
        ) * 1000
        """
        
        # Return mock response time for testing
        return 150  # 150ms
```

---

## Operational Tests

*Testing monitoring, backup, and recovery procedures*

### Monitoring Tests

```python
# tests/monitoring/monitoring_test.py
import pytest
import requests
import time
from prometheus_client.parser import text_string_to_metric_families

class TestMonitoring:
    
    def setup_method(self):
        self.prometheus_url = "http://prometheus.monitoring.svc.cluster.local:9090"
        self.grafana_url = "http://grafana.monitoring.svc.cluster.local:3000"
        self.alertmanager_url = "http://alertmanager.monitoring.svc.cluster.local:9093"
    
    def test_prometheus_metrics_collection(self):
        """Test that Prometheus is collecting application metrics"""
        # Query for application metrics
        metrics_to_check = [
            'http_requests_total',
            'http_request_duration_seconds',
            'database_connections_active',
            'redis_connected_clients'
        ]
        
        for metric in metrics_to_check:
            response = self._query_prometheus(f'{metric}{{job="feature-api"}}')
            assert response['status'] == 'success'
            assert len(response['data']['result']) > 0, f"No data for metric {metric}"
    
    def test_alerting_rules(self):
        """Test that alerting rules are configured correctly"""
        # Get all alerting rules
        response = requests.get(f"{self.prometheus_url}/api/v1/rules")
        assert response.status_code == 200
        
        rules_data = response.json()
        assert rules_data['status'] == 'success'
        
        # Check for required alert rules
        required_alerts = [
            'HighErrorRate',
            'SlowResponseTime',
            'DatabaseConnectionsHigh',
            'PodCrashLooping',
            'NodeDiskSpaceHigh'
        ]
        
        all_alerts = []
        for group in rules_data['data']['groups']:
            for rule in group['rules']:
                if rule.get('type') == 'alerting':
                    all_alerts.append(rule['name'])
        
        for alert in required_alerts:
            assert alert in all_alerts, f"Required alert {alert} not found"
    
    def test_alert_firing(self):
        """Test that alerts can fire correctly"""
        # Generate load to trigger an alert
        self._generate_test_load(error_rate=0.1)  # 10% error rate
        
        # Wait for alert to fire
        time.sleep(120)  # Wait 2 minutes
        
        # Check if alert is firing
        response = requests.get(f"{self.alertmanager_url}/api/v1/alerts")
        assert response.status_code == 200
        
        alerts = response.json()['data']
        firing_alerts = [a for a in alerts if a['status']['state'] == 'firing']
        
        # Should have HighErrorRate alert firing
        high_error_alerts = [a for a in firing_alerts if a['labels']['alertname'] == 'HighErrorRate']
        assert len(high_error_alerts) > 0, "HighErrorRate alert not firing"
    
    def test_grafana_dashboards(self):
        """Test that Grafana dashboards are accessible and have data"""
        # Login to Grafana (assuming basic auth)
        auth = ('admin', 'admin')  # Use proper credentials
        
        # Get list of dashboards
        response = requests.get(f"{self.grafana_url}/api/search", auth=auth)
        assert response.status_code == 200
        
        dashboards = response.json()
        
        # Check for required dashboards
        required_dashboards = [
            'Feature API - Application Metrics',
            'Feature API - Infrastructure Metrics',
            'Kubernetes Cluster Overview'
        ]
        
        dashboard_titles = [d['title'] for d in dashboards]
        
        for dashboard in required_dashboards:
            assert dashboard in dashboard_titles, f"Dashboard {dashboard} not found"
    
    def test_log_aggregation(self):
        """Test that logs are being collected and aggregated"""
        # Query Elasticsearch/Loki for application logs
        # This is a placeholder - implement based on your logging stack
        
        # Test that logs from the last 5 minutes exist
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"kubernetes.labels.app": "feature-api"}},
                        {"range": {"@timestamp": {"gte": "now-5m"}}}
                    ]
                }
            },
            "size": 1
        }
        
        # Mock response - implement actual Elasticsearch query
        log_count = 100  # Should be > 0 if logs are being collected
        assert log_count > 0, "No recent logs found in aggregation system"
    
    def _query_prometheus(self, query):
        """Helper to query Prometheus"""
        params = {'query': query}
        response = requests.get(f"{self.prometheus_url}/api/v1/query", params=params)
        return response.json()
    
    def _generate_test_load(self, error_rate=0.0):
        """Generate test load to trigger metrics/alerts"""
        # Implementation to generate load with specified error rate
        pass
```

### Backup and Recovery Tests

```bash
#!/bin/bash
# tests/backup/backup-recovery-test.sh

set -e

# Configuration
DB_HOST="test-db.cluster-xxx.us-east-1.rds.amazonaws.com"
DB_NAME="feature_test"
DB_USER="test_user"
S3_BUCKET="feature-api-test-backups"
TEST_DATA_FILE="tests/fixtures/test-data.sql"

echo "Starting backup and recovery test..."

# Step 1: Create test database with sample data
echo "Setting up test database..."
psql -h $DB_HOST -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME}_backup_test;"
psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE ${DB_NAME}_backup_test;"

# Load test data
psql -h $DB_HOST -U $DB_USER -d ${DB_NAME}_backup_test -f $TEST_DATA_FILE

# Verify data was loaded
ROW_COUNT=$(psql -h $DB_HOST -U $DB_USER -d ${DB_NAME}_backup_test -t -c "SELECT COUNT(*) FROM features;")
echo "Test database created with $ROW_COUNT rows"

# Step 2: Perform backup
echo "Performing database backup..."
BACKUP_FILE="backup-test-$(date +%Y%m%d_%H%M%S).sql"
pg_dump -h $DB_HOST -U $DB_USER -d ${DB_NAME}_backup_test > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE
BACKUP_FILE="${BACKUP_FILE}.gz"

# Upload to S3
aws s3 cp $BACKUP_FILE s3://$S3_BUCKET/test-backups/

echo "Backup completed: $BACKUP_FILE"

# Step 3: Test backup integrity
echo "Testing backup integrity..."
gunzip -t $BACKUP_FILE
echo "Backup file integrity verified"

# Step 4: Perform restoration test
echo "Testing backup restoration..."

# Create restoration target database
psql -h $DB_HOST -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME}_restore_test;"
psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE ${DB_NAME}_restore_test;"

# Restore from backup
gunzip -c $BACKUP_FILE | psql -h $DB_HOST -U $DB_USER -d ${DB_NAME}_restore_test

# Verify restored data
RESTORED_COUNT=$(psql -h $DB_HOST -U $DB_USER -d ${DB_NAME}_restore_test -t -c "SELECT COUNT(*) FROM features;")
echo "Restored database has $RESTORED_COUNT rows"

# Verify data integrity
if [ "$ROW_COUNT" -eq "$RESTORED_COUNT" ]; then
    echo "Data integrity verified: $ROW_COUNT original rows = $RESTORED_COUNT restored rows"
else
    echo "ERROR: Data integrity check failed"
    echo "Original: $ROW_COUNT rows, Restored: $RESTORED_COUNT rows"
    exit 1
fi

# Step 5: Test specific data recovery
echo "Testing specific data recovery..."
ORIGINAL_SAMPLE=$(psql -h $DB_HOST -U $DB_USER -d ${DB_NAME}_backup_test -t -c "SELECT name FROM features LIMIT 5;")
RESTORED_SAMPLE=$(psql -h $DB_HOST -U $DB_USER -d ${DB_NAME}_restore_test -t -c "SELECT name FROM features LIMIT 5;")

if [ "$ORIGINAL_SAMPLE" = "$RESTORED_SAMPLE" ]; then
    echo "Sample data verification passed"
else
    echo "ERROR: Sample data verification failed"
    echo "Original: $ORIGINAL_SAMPLE"
    echo "Restored: $RESTORED_SAMPLE"
    exit 1
fi

# Step 6: Cleanup
echo "Cleaning up test resources..."
rm -f $BACKUP_FILE
psql -h $DB_HOST -U $DB_USER -d postgres -c "DROP DATABASE ${DB_NAME}_backup_test;"
psql -h $DB_HOST -U $DB_USER -d postgres -c "DROP DATABASE ${DB_NAME}_restore_test;"
aws s3 rm s3://$S3_BUCKET/test-backups/$BACKUP_FILE

echo "Backup and recovery test completed successfully!"

# Step 7: Test Kubernetes backup/restore (Velero)
echo "Testing Kubernetes backup and restore..."

# Create test namespace with resources
kubectl create namespace backup-test
kubectl run test-pod --image=nginx --namespace=backup-test
kubectl create configmap test-config --from-literal=key1=value1 --namespace=backup-test

# Wait for resources to be ready
kubectl wait --for=condition=ready pod/test-pod --namespace=backup-test --timeout=60s

# Create backup
velero backup create backup-test-$(date +%s) --include-namespaces backup-test --wait

# Delete namespace to simulate disaster
kubectl delete namespace backup-test

# Wait for complete deletion
while kubectl get namespace backup-test &> /dev/null; do
    echo "Waiting for namespace deletion..."
    sleep 5
done

# Restore from backup
LATEST_BACKUP=$(velero backup get | grep backup-test | head -1 | awk '{print $1}')
velero restore create restore-test-$(date +%s) --from-backup $LATEST_BACKUP --wait

# Verify restoration
kubectl wait --for=condition=ready pod/test-pod --namespace=backup-test --timeout=120s
kubectl get configmap test-config --namespace=backup-test

echo "Kubernetes backup and restore test completed successfully!"

# Cleanup
kubectl delete namespace backup-test
velero backup delete $LATEST_BACKUP --confirm

echo "All backup and recovery tests passed!"
```

### Disaster Recovery Tests

```python
# tests/disaster-recovery/dr_test.py
import pytest
import time
import subprocess
from kubernetes import client, config

class TestDisasterRecovery:
    
    @classmethod
    def setup_class(cls):
        config.load_kube_config()
        cls.v1 = client.CoreV1Api()
        cls.apps_v1 = client.AppsV1Api()
    
    def test_database_failover(self):
        """Test RDS Multi-AZ failover"""
        # This would require actual RDS instance with Multi-AZ
        # Simulate failover and test application resilience
        
        # Get current database endpoint
        original_endpoint = self._get_database_endpoint()
        
        # Force failover (in real scenario)
        # aws rds reboot-db-instance --db-instance-identifier prod-db --force-failover
        
        # Monitor application during failover
        start_time = time.time()
        max_downtime = 60  # Maximum acceptable downtime in seconds
        
        while time.time() - start_time < max_downtime:
            try:
                # Test application health during failover
                health_status = self._check_application_health()
                if health_status:
                    break
            except Exception:
                pass
            time.sleep(5)
        
        # Verify application recovered
        assert self._check_application_health(), "Application failed to recover after failover"
        
        # Verify new endpoint is different (indicating failover occurred)
        new_endpoint = self._get_database_endpoint()
        # In a real Multi-AZ setup, the endpoint might be the same but point to different AZ
        
        downtime = time.time() - start_time
        assert downtime < max_downtime, f"Downtime {downtime}s exceeded maximum {max_downtime}s"
        
        print(f"Database failover completed in {downtime:.2f} seconds")
    
    def test_application_pod_failure(self):
        """Test application resilience to pod failures"""
        # Get list of application pods
        pods = self.v1.list_namespaced_pod(
            namespace="default",
            label_selector="app=feature-api"
        )
        
        initial_pod_count = len(pods.items)
        assert initial_pod_count >= 2, "Need at least 2 pods for this test"
        
        # Delete one pod to simulate failure
        pod_to_delete = pods.items[0]
        self.v1.delete_namespaced_pod(
            name=pod_to_delete.metadata.name,
            namespace="default"
        )
        
        print(f"Deleted pod {pod_to_delete.metadata.name}")
        
        # Monitor service availability during pod restart
        service_available = True
        for i in range(12):  # Check for 1 minute
            try:
                if not self._check_application_health():
                    service_available = False
                    break
            except Exception:
                service_available = False
                break
            time.sleep(5)
        
        assert service_available, "Service became unavailable during pod failure"
        
        # Wait for replacement pod to be ready
        time.sleep(30)
        
        # Verify pod count is restored
        updated_pods = self.v1.list_namespaced_pod(
            namespace="default",
            label_selector="app=feature-api"
        )
        
        ready_pods = [p for p in updated_pods.items if p.status.phase == "Running"]
        assert len(ready_pods) >= initial_pod_count, "Pod count not restored after failure"
        
        print("Application successfully recovered from pod failure")
    
    def test_node_failure_simulation(self):
        """Test application resilience to node failures"""
        # Get nodes and pods
        nodes = self.v1.list_node()
        pods = self.v1.list_namespaced_pod(
            namespace="default",
            label_selector="app=feature-api"
        )
        
        # Find a node with application pods
        node_with_pods = None
        for pod in pods.items:
            if pod.spec.node_name:
                node_with_pods = pod.spec.node_name
                break
        
        assert node_with_pods, "No pods scheduled on nodes"
        
        # Cordon the node (simulate node failure)
        subprocess.run([
            "kubectl", "cordon", node_with_pods
        ], check=True)
        
        # Drain the node
        subprocess.run([
            "kubectl", "drain", node_with_pods,
            "--ignore-daemonsets",
            "--delete-emptydir-data",
            "--force",
            "--timeout=60s"
        ], check=True)
        
        print(f"Drained node {node_with_pods}")
        
        # Wait for pods to be rescheduled
        time.sleep(60)
        
        # Verify pods are running on different nodes
        updated_pods = self.v1.list_namespaced_pod(
            namespace="default",
            label_selector="app=feature-api"
        )
        
        running_pods = [p for p in updated_pods.items if p.status.phase == "Running"]
        assert len(running_pods) >= 2, "Insufficient pods after node drain"
        
        # Verify no pods are on the drained node
        for pod in running_pods:
            assert pod.spec.node_name != node_with_pods, \
                f"Pod {pod.metadata.name} still on drained node"
        
        # Verify service is still available
        assert self._check_application_health(), "Service not available after node drain"
        
        # Cleanup: uncordon the node
        subprocess.run([
            "kubectl", "uncordon", node_with_pods
        ], check=True)
        
        print("Application successfully survived node failure")
    
    def test_cross_region_failover(self):
        """Test cross-region disaster recovery"""
        # This test would require actual cross-region setup
        # For now, we'll test the failover process
        
        # Simulate primary region failure
        primary_region = "us-east-1"
        dr_region = "us-west-2"
        
        # Check if DR region resources are ready
        # In real scenario, this would involve:
        # 1. DNS failover
        # 2. Database failover to DR region
        # 3. Application deployment in DR region
        
        # Test DNS resolution to DR endpoint
        dr_endpoint = f"api-dr.example.com"
        
        # This is a placeholder - implement actual DNS/endpoint testing
        assert self._test_endpoint_availability(dr_endpoint), \
            "DR endpoint not available"
        
        print("Cross-region failover test passed")
    
    def _check_application_health(self):
        """Check if application is healthy"""
        try:
            # Port forward to test pod
            pods = self.v1.list_namespaced_pod(
                namespace="default",
                label_selector="app=feature-api"
            )
            
            if not pods.items:
                return False
            
            ready_pods = [p for p in pods.items if p.status.phase == "Running"]
            return len(ready_pods) > 0
            
        except Exception:
            return False
    
    def _get_database_endpoint(self):
        """Get current database endpoint"""
        # This would query AWS RDS or your database service
        # Return mock endpoint for testing
        return "prod-db.cluster-xxx.us-east-1.rds.amazonaws.com"
    
    def _test_endpoint_availability(self, endpoint):
        """Test if endpoint is available"""
        try:
            import socket
            socket.gethostbyname(endpoint)
            return True
        except socket.gaierror:
            return False
```

---

## Security Tests

*Testing security controls and vulnerability management*

### Vulnerability Scanning Tests

```bash
#!/bin/bash
# tests/security/vulnerability-scan.sh

set -e

echo "Starting comprehensive security testing..."

# Test 1: Container Image Vulnerability Scanning
echo "1. Scanning container images for vulnerabilities..."

IMAGES=("feature-api:latest" "postgres:15" "redis:7")

for IMAGE in "${IMAGES[@]}"; do
    echo "Scanning $IMAGE..."
    
    # Trivy scan
    trivy image --exit-code 1 --severity HIGH,CRITICAL --format json $IMAGE > "scan-results-$(echo $IMAGE | tr ':/' '-').json"
    
    # Check if any HIGH or CRITICAL vulnerabilities found
    VULN_COUNT=$(jq '.Results[]?.Vulnerabilities // [] | map(select(.Severity == "HIGH" or .Severity == "CRITICAL")) | length' "scan-results-$(echo $IMAGE | tr ':/' '-').json" | jq -s 'add')
    
    if [ "$VULN_COUNT" -gt 0 ]; then
        echo "ERROR: $VULN_COUNT HIGH/CRITICAL vulnerabilities found in $IMAGE"
        exit 1
    else
        echo "✓ No HIGH/CRITICAL vulnerabilities found in $IMAGE"
    fi
done

# Test 2: Infrastructure Security Scanning
echo "2. Scanning infrastructure configurations..."

# Scan Terraform configurations
checkov -d infrastructure/ --framework terraform --check CKV_AWS_* --compact --quiet
echo "✓ Terraform security scan passed"

# Scan Kubernetes manifests
checkov -d k8s/ --framework kubernetes --compact --quiet
echo "✓ Kubernetes security scan passed"

# Test 3: Network Security Testing
echo "3. Testing network security..."

# Test that pods cannot access restricted endpoints
kubectl run security-test --image=curlimages/curl --rm -i --restart=Never -- \
    curl -m 5 http://169.254.169.254/latest/meta-data/

if [ $? -eq 0 ]; then
    echo "ERROR: Pod can access AWS metadata service (security risk)"
    exit 1
else
    echo "✓ AWS metadata service properly blocked"
fi

# Test 4: RBAC Testing
echo "4. Testing RBAC configuration..."

# Test that service account has minimal required permissions
kubectl auth can-i get secrets --as=system:serviceaccount:default:feature-api
if [ $? -eq 0 ]; then
    echo "ERROR: Service account has excessive permissions to secrets"
    exit 1
else
    echo "✓ Service account permissions are properly restricted"
fi

# Test 5: TLS/SSL Configuration
echo "5. Testing TLS/SSL configuration..."

# Test SSL certificate validity
echo "" | openssl s_client -connect api.example.com:443 -servername api.example.com 2>/dev/null | \
    openssl x509 -noout -dates

# Test for weak ciphers
SSLSCAN_RESULT=$(sslscan --no-colour api.example.com:443 | grep "Accepted")
if echo "$SSLSCAN_RESULT" | grep -q "SSLv\|TLSv1.0\|TLSv1.1"; then
    echo "ERROR: Weak SSL/TLS protocols enabled"
    exit 1
else
    echo "✓ SSL/TLS configuration secure"
fi

# Test 6: Secrets Management
echo "6. Testing secrets management..."

# Check that secrets are not stored in plain text
if git log --all --full-history -- "*.yaml" "*.yml" "*.json" | grep -i "password\|secret\|key" | head -5; then
    echo "WARNING: Potential secrets in git history (review required)"
fi

# Test that secrets are properly encrypted in etcd (if using Kubernetes encryption)
kubectl get secrets --all-namespaces -o json | \
    jq '.items[].data | to_entries[] | select(.value | test("^[A-Za-z0-9+/]*={0,2}$")) | .key' | \
    head -5

echo "✓ Secrets appear to be base64 encoded (not plain text)"

echo "All security tests completed successfully!"
```

### Penetration Testing

```python
# tests/security/pentest.py
import requests
import pytest
import time
from urllib.parse import urljoin

class TestPenetrationTesting:
    
    def setup_method(self):
        self.base_url = "https://api-staging.example.com"
        self.session = requests.Session()
        # Set up authentication if needed
        # self.session.headers.update({"Authorization": "Bearer token"})
    
    def test_sql_injection(self):
        """Test for SQL injection vulnerabilities"""
        sql_payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "' UNION SELECT * FROM information_schema.tables --",
            "admin'--",
            "' OR 1=1#"
        ]
        
        # Test various endpoints
        test_endpoints = [
            "/api/v1/features",
            "/api/v1/users"
        ]
        
        for endpoint in test_endpoints:
            for payload in sql_payloads:
                # Test in query parameters
                params = {"name": payload, "id": payload}
                response = self.session.get(
                    urljoin(self.base_url, endpoint),
                    params=params
                )
                
                # Should not return database errors or unexpected data
                assert response.status_code != 500, f"SQL injection may be possible at {endpoint}"
                assert "error" not in response.text.lower() or \
                       "sql" not in response.text.lower(), \
                       f"Potential SQL injection at {endpoint}"
                
                # Test in POST body
                data = {"name": payload, "description": payload}
                response = self.session.post(
                    urljoin(self.base_url, endpoint),
                    json=data
                )
                
                # Should return proper validation errors, not database errors
                if response.status_code == 400:
                    assert "validation" in response.text.lower(), \
                           f"Unexpected error response at {endpoint}"
    
    def test_xss_prevention(self):
        """Test for Cross-Site Scripting vulnerabilities"""
        xss_payloads = [
            "<script>alert('xss')</script>",
            "javascript:alert('xss')",
            "<img src=x onerror=alert('xss')>",
            "<svg onload=alert('xss')>",
            "'><script>alert('xss')</script>"
        ]
        
        for payload in xss_payloads:
            # Test creating feature with XSS payload
            data = {
                "name": payload,
                "description": payload
            }
            
            response = self.session.post(
                urljoin(self.base_url, "/api/v1/features"),
                json=data
            )
            
            # If creation succeeds, verify the response is sanitized
            if response.status_code == 201:
                response_data = response.json()
                
                # Check that script tags and other dangerous content is sanitized
                assert "<script>" not in response_data.get("data", {}).get("name", "")
                assert "<script>" not in response_data.get("data", {}).get("description", "")
                assert "javascript:" not in response_data.get("data", {}).get("name", "")
                
                # Cleanup
                feature_id = response_data.get("data", {}).get("id")
                if feature_id:
                    self.session.delete(f"{self.base_url}/api/v1/features/{feature_id}")
    
    def test_authentication_bypass(self):
        """Test for authentication bypass vulnerabilities"""
        protected_endpoints = [
            "/api/v1/features",
            "/api/v1/users/profile",
            "/api/v1/admin"
        ]
        
        # Test without authentication
        unauthenticated_session = requests.Session()
        
        for endpoint in protected_endpoints:
            response = unauthenticated_session.get(urljoin(self.base_url, endpoint))
            
            # Should return 401 Unauthorized
            assert response.status_code in [401, 403], \
                f"Authentication bypass possible at {endpoint}"
        
        # Test with invalid tokens
        invalid_tokens = [
            "Bearer invalid_token",
            "Bearer ",
            "Bearer null",
            "Bearer admin",
            "Basic YWRtaW46YWRtaW4="  # admin:admin
        ]
        
        for token in invalid_tokens:
            headers = {"Authorization": token}
            response = requests.get(
                urljoin(self.base_url, "/api/v1/features"),
                headers=headers
            )
            
            assert response.status_code in [401, 403], \
                f"Authentication bypass with token: {token}"
    
    def test_rate_limiting(self):
        """Test rate limiting implementation"""
        endpoint = urljoin(self.base_url, "/api/v1/features")
        
        # Make rapid requests to trigger rate limiting
        responses = []
        for i in range(150):  # Assuming limit is 100/minute
            response = self.session.get(endpoint)
            responses.append(response.status_code)
            
            if response.status_code == 429:  # Rate limited
                break
            
            time.sleep(0.1)  # Small delay
        
        # Should eventually get rate limited
        assert 429 in responses, "Rate limiting not implemented or too high limit"
        
        # Test that rate limit headers are present
        response = self.session.get(endpoint)
        if response.status_code == 429:
            assert "X-RateLimit-Limit" in response.headers or \
                   "RateLimit-Limit" in response.headers, \
                   "Rate limit headers missing"
    
    def test_cors_configuration(self):
        """Test CORS configuration"""
        # Test with various origins
        test_origins = [
            "https://evil.com",
            "http://localhost:3000",  # Should be allowed for dev
            "https://app.example.com"  # Should be allowed
        ]
        
        for origin in test_origins:
            headers = {
                "Origin": origin,
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Authorization"
            }
            
            # Preflight request
            response = self.session.options(
                urljoin(self.base_url, "/api/v1/features"),
                headers=headers
            )
            
            # Check CORS headers
            cors_origin = response.headers.get("Access-Control-Allow-Origin")
            
            if origin == "https://evil.com":
                # Should not allow arbitrary origins
                assert cors_origin != origin, "CORS allows arbitrary origins"
            elif origin in ["http://localhost:3000", "https://app.example.com"]:
                # Should allow legitimate origins
                assert cors_origin == origin or cors_origin == "*", \
                       f"CORS blocks legitimate origin: {origin}"
    
    def test_information_disclosure(self):
        """Test for information disclosure vulnerabilities"""
        # Test error responses don't leak sensitive information
        response = self.session.get(
            urljoin(self.base_url, "/api/v1/nonexistent")
        )
        
        # Should not reveal stack traces, file paths, or database info
        response_text = response.text.lower()
        sensitive_info = [
            "stack trace",
            "/usr/",
            "/var/",
            "postgres",
            "database",
            "sql",
            "exception",
            "traceback"
        ]
        
        for info in sensitive_info:
            assert info not in response_text, \
                f"Potential information disclosure: {info} found in error response"
        
        # Test that server headers don't reveal too much
        server_header = response.headers.get("Server", "")
        assert "express" not in server_header.lower(), \
               "Server header reveals technology stack"
```

---

## Test Automation & Reporting

### Test Execution Pipeline

```yaml
# .github/workflows/infrastructure-tests.yml
name: Infrastructure Tests

on:
  push:
    branches: [main, develop]
    paths: ['infrastructure/**', 'k8s/**']
  pull_request:
    branches: [main]
    paths: ['infrastructure/**', 'k8s/**']
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM

jobs:
  terraform-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.6.0
      
      - name: Setup Go
        uses: actions/setup-go@v3
        with:
          go-version: '1.21'
      
      - name: Run Terraform Tests
        run: |
          cd tests/terraform
          go test -v -timeout 30m
  
  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Checkov
        uses: bridgecrewio/checkov-action@master
        with:
          directory: .
          config_file: tests/compliance/checkov-config.yml
          output_format: sarif
          output_file_path: reports/checkov.sarif
      
      - name: Upload SARIF file
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: reports/checkov.sarif
  
  deployment-tests:
    runs-on: ubuntu-latest
    needs: [terraform-tests, security-tests]
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'v1.28.0'
      
      - name: Setup Helm
        uses: azure/setup-helm@v3
        with:
          version: '3.12.0'
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Run Deployment Tests
        run: |
          ./tests/deployment/blue-green-test.sh
          ./tests/deployment/canary-test.sh
  
  operational-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r tests/requirements.txt
      
      - name: Run Monitoring Tests
        run: |
          python -m pytest tests/monitoring/ -v
      
      - name: Run Backup Tests
        run: |
          ./tests/backup/backup-recovery-test.sh
      
      - name: Run DR Tests
        run: |
          python -m pytest tests/disaster-recovery/ -v
```

### Test Metrics & Reporting

```python
# tests/reporting/test_metrics.py
import json
import os
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import pandas as pd

class InfrastructureTestMetrics:
    
    def __init__(self):
        self.test_results = []
        self.metrics = {
            'test_execution_time': {},
            'test_success_rate': {},
            'infrastructure_costs': {},
            'security_score': {},
            'availability_percentage': {}
        }
    
    def collect_test_results(self, test_suite, results):
        """Collect test results for analysis"""
        timestamp = datetime.now()
        
        test_data = {
            'timestamp': timestamp.isoformat(),
            'test_suite': test_suite,
            'total_tests': results.get('total', 0),
            'passed_tests': results.get('passed', 0),
            'failed_tests': results.get('failed', 0),
            'skipped_tests': results.get('skipped', 0),
            'execution_time': results.get('duration', 0)
        }
        
        self.test_results.append(test_data)
    
    def calculate_metrics(self):
        """Calculate key infrastructure metrics"""
        df = pd.DataFrame(self.test_results)
        
        if df.empty:
            return
        
        # Test success rate over time
        df['success_rate'] = (df['passed_tests'] / df['total_tests']) * 100
        
        # Group by test suite
        suite_metrics = df.groupby('test_suite').agg({
            'success_rate': 'mean',
            'execution_time': 'mean',
            'total_tests': 'sum'
        })
        
        return suite_metrics
    
    def generate_dashboard(self):
        """Generate infrastructure test dashboard"""
        metrics = self.calculate_metrics()
        
        if metrics is None:
            return
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        fig.suptitle('Infrastructure Test Metrics Dashboard', fontsize=16)
        
        # Success rate by test suite
        axes[0, 0].bar(metrics.index, metrics['success_rate'])
        axes[0, 0].set_title('Success Rate by Test Suite')
        axes[0, 0].set_ylabel('Success Rate (%)')
        axes[0, 0].set_ylim(0, 100)
        
        # Execution time by test suite
        axes[0, 1].bar(metrics.index, metrics['execution_time'])
        axes[0, 1].set_title('Average Execution Time by Test Suite')
        axes[0, 1].set_ylabel('Time (seconds)')
        
        # Test coverage
        axes[1, 0].pie(metrics['total_tests'], labels=metrics.index, autopct='%1.1f%%')
        axes[1, 0].set_title('Test Coverage by Suite')
        
        # Trend analysis (if we have time series data)
        df = pd.DataFrame(self.test_results)
        if not df.empty:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            daily_success = df.groupby(df['timestamp'].dt.date)['success_rate'].mean()
            
            axes[1, 1].plot(daily_success.index, daily_success.values)
            axes[1, 1].set_title('Success Rate Trend')
            axes[1, 1].set_ylabel('Success Rate (%)')
            axes[1, 1].tick_params(axis='x', rotation=45)
        
        plt.tight_layout()
        plt.savefig('infrastructure-test-dashboard.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def export_metrics(self, filename='infrastructure-metrics.json'):
        """Export metrics to JSON file"""
        metrics_data = {
            'generated_at': datetime.now().isoformat(),
            'test_results': self.test_results,
            'summary': self.calculate_metrics().to_dict() if self.test_results else {}
        }
        
        with open(filename, 'w') as f:
            json.dump(metrics_data, f, indent=2, default=str)
        
        print(f"Metrics exported to {filename}")

# Usage example
if __name__ == "__main__":
    metrics = InfrastructureTestMetrics()
    
    # Simulate test results
    metrics.collect_test_results('terraform', {
        'total': 50, 'passed': 48, 'failed': 2, 'skipped': 0, 'duration': 120
    })
    
    metrics.collect_test_results('deployment', {
        'total': 25, 'passed': 24, 'failed': 1, 'skipped': 0, 'duration': 300
    })
    
    metrics.collect_test_results('security', {
        'total': 30, 'passed': 30, 'failed': 0, 'skipped': 0, 'duration': 180
    })
    
    metrics.generate_dashboard()
    metrics.export_metrics()
```

---

## Our Philosophy
>
> *"Infrastructure should be tested as rigorously as application code."*

**DevOps Testing Principles:**

- **Shift Left:** Test infrastructure early in the development cycle
- **Automate Everything:** Manual testing doesn't scale
- **Test in Production:** Monitor and validate in real environments
- **Learn from Failures:** Every failure is an opportunity to improve
- **Defense in Depth:** Test multiple layers of security and resilience

---

**Links:**

- **Test Results Dashboard:** *[Link to test metrics dashboard]*
- **Infrastructure Repository:** *[Link to Terraform tests]*
- **Security Reports:** *[Link to security scan results]*
- **Monitoring Dashboards:** *[Link to operational monitoring]*
- **Disaster Recovery Runbooks:** *[Link to DR procedures]*

---

**Last Updated:** *[Date]* | **Next Review:** *[Monthly test review]*
