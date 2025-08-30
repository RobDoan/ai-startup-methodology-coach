# Release Runbook: Guardrails, Not Handcuffs

> **Make the safe path the easy path.**  
>
> This runbook exists to eliminate thinking during deployments, not eliminate judgment.

## Our Philosophy

We don't follow process for process sake. These are **guardrails that enable velocity**—tested procedures that let us ship with confidence. When something goes wrong, we fix the guardrails, not blame the person.

**Core Principle:** "If it's not automated, it's not documented. If it's not documented, it's not repeatable."

---

## ⚡ Emergency Quick Reference

### 🚨 Something Broke? Start Here

```bash
# 1. IMMEDIATE: Stop the bleeding
./scripts/rollback-last-release.sh

# 2. ASSESS: Check system health  
./scripts/health-check.sh

# 3. COMMUNICATE: Alert the team
./scripts/incident-alert.sh "[brief description]"
```

### 🎯 Pre-Flight Checklist (30 seconds)

- [ ] **All tests passing:** `./scripts/verify-tests.sh`
- [ ] **No active incidents:** Check monitoring dashboard
- [ ] **Rollback plan ready:** Confirm previous version available
- [ ] **Team aware:** Release announced in #releases channel

---

## 🚀 Standard Release Process

### Pre-Release (5 minutes)

**Experiment Brief driving this release:** [Link to experiment-brief.md]

```bash
# 1. Verify readiness
./scripts/pre-release-check.sh

# 2. Create release branch
git checkout -b release/$(date +%Y.%m.%d)

# 3. Run automated release prep
./scripts/prepare-release.sh
```

**Expected Output:** ✅ All checks pass, release artifacts created

**If Failed:** See [Troubleshooting](#troubleshooting) section

### Deploy to Staging (2 minutes)

```bash
# 1. Deploy to staging
./scripts/deploy-staging.sh

# 2. Run smoke tests
./scripts/smoke-test-staging.sh

# 3. Verify critical paths
./scripts/verify-critical-paths.sh staging
```

**Success Criteria:**

- [ ] All smoke tests pass
- [ ] Response times < 500ms
- [ ] No error spikes in logs

### Deploy to Production (3 minutes)

```bash
# 1. Deploy with blue-green strategy
./scripts/deploy-production.sh

# 2. Verify health immediately
./scripts/production-health-check.sh

# 3. Monitor for 5 minutes
./scripts/monitor-deployment.sh --duration=5m
```

**Success Criteria:**

- [ ] Zero 5xx errors
- [ ] Response times within SLA
- [ ] All key metrics stable

### Post-Release (2 minutes)

```bash
# 1. Update release log
./scripts/log-release.sh "$(git describe --tags)"

# 2. Clean up old artifacts
./scripts/cleanup-old-releases.sh

# 3. Notify stakeholders
./scripts/notify-release-complete.sh
```

---

## 🛡️ Rollback Procedures

### Automatic Rollback Triggers

*These conditions trigger automatic rollback - no human decision needed*

- Error rate > 1% for 2 consecutive minutes
- Response time > 2 seconds for 3 consecutive minutes  
- Any 5xx error on critical endpoints
- Memory usage > 85% for 5 minutes

### Manual Rollback (30 seconds)

```bash
# 1. IMMEDIATE: Rollback to last known good
./scripts/rollback-production.sh

# 2. VERIFY: Confirm rollback successful
./scripts/verify-rollback.sh

# 3. INVESTIGATE: Start incident response
./scripts/create-incident.sh "Production rollback executed"
```

> **🤖 Automation Note:** Rollbacks automatically trigger risk register updates via [`risk-incident-sync`](../support-tools/risk-incident-sync/)

### Rollback Verification Checklist

- [ ] Application responding normally
- [ ] Error rates back to baseline
- [ ] Database integrity confirmed
- [ ] External integrations working

---

## 📊 Monitoring & Alerts

### Key Metrics Dashboard

*Single source of truth for release health*

**Location:** [Dashboard URL]

**Critical Thresholds:**

- **Response Time:** < 500ms (Warning), < 1s (Critical)
- **Error Rate:** < 0.1% (Warning), < 0.5% (Critical)  
- **Throughput:** > [baseline] (Warning if drops 20%)
- **Memory Usage:** < 70% (Warning), < 85% (Critical)

### Alert Escalation

1. **Level 1 (0-5 min):** Automated alerts to #releases
2. **Level 2 (5-15 min):** Page on-call engineer
3. **Level 3 (15+ min):** Escalate to engineering leadership

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### "Tests failing in CI/CD"

```bash
# Quick fix: Retry flaky tests
./scripts/retry-failed-tests.sh

# Deep dive: Check test environment
./scripts/diagnose-test-environment.sh
```

#### "Deployment stuck/timing out"

```bash
# Check deployment status
./scripts/check-deployment-status.sh

# Force rollback if needed
./scripts/force-rollback.sh --confirm
```

#### "Database migration failed"

```bash
# Check migration status
./scripts/check-migration-status.sh

# Rollback migration if safe
./scripts/rollback-migration.sh --dry-run
```

### Escalation Path

1. **Self-service:** Use troubleshooting scripts above
2. **Team Help:** Ask in #engineering-help  
3. **On-Call:** Page if production impacted
4. **Leadership:** Escalate if customer-facing impact

---

## 🧪 Experimental Releases

### Feature Flag Deployments

*For testing new features with subset of users*

```bash
# 1. Deploy code with feature disabled
./scripts/deploy-with-flags.sh --feature=new-feature --enabled=false

# 2. Enable for 5% of users
./scripts/enable-feature-flag.sh --feature=new-feature --percentage=5

# 3. Monitor and adjust
./scripts/monitor-feature-flag.sh --feature=new-feature
```

### A/B Test Deployments

*For running controlled experiments*

```bash
# 1. Deploy both variants
./scripts/deploy-ab-test.sh --experiment=checkout-flow-v2

# 2. Monitor experiment metrics
./scripts/monitor-experiment.sh --experiment=checkout-flow-v2

# 3. Make decision based on data
./scripts/conclude-experiment.sh --experiment=checkout-flow-v2
```

---

## 🎯 Release Success Metrics

### Release Velocity

- **Deployment Frequency:** [Target: daily/weekly]
- **Lead Time:** [Target: < X hours from commit to production]
- **Recovery Time:** [Target: < X minutes to rollback]

### Quality Metrics  

- **Change Failure Rate:** [Target: < X%]
- **Rollback Rate:** [Target: < X%]
- **Post-Release Issues:** [Target: < X per release]

### Team Confidence

- **Process Satisfaction:** [Regular team survey]
- **Deployment Anxiety:** [1-5 scale, target: < 2]
- **Time Spent on Releases:** [Target: < X minutes]

---

## 📚 Knowledge Base

### Release History Log

*Learn from past releases*

| Date | Version | Changes | Issues | Recovery Time | Learnings |
|------|---------|---------|---------|---------------|-----------|
| [Date] | [v1.2.3] | [Summary] | [None/Details] | [N/A/Time] | [What we learned] |

### Runbook Evolution

*How this runbook should improve*

**Current Pain Points:**

- [ ] [Issue 1: e.g., "Manual step X takes too long"]
- [ ] [Issue 2: e.g., "Alert Y has too many false positives"]

**Planned Improvements:**

- [ ] [Improvement 1: e.g., "Automate step X"]
- [ ] [Improvement 2: e.g., "Tune alert Y thresholds"]

**Success Metrics for This Runbook:**

- Deployment time: Currently [X min], Target [Y min]
- Rollback time: Currently [X min], Target [Y min]  
- Process confidence: Currently [X/5], Target [Y/5]

---

## 🔗 Related Documents

- **[Experiment Brief Template](../experiments/experiment-brief.md)** - For feature flag experiments
- **[Architecture Decisions](../decisions/)** - For understanding system changes
- **[Incident Response](incident-response.md)** - For when things go really wrong
- **[Testing Manifesto](../practices/testing-manifesto.md)** - For understanding our testing approach

---

## 🎉 Release Celebration

### When We Ship Successfully

- [ ] Update team in #releases with metrics
- [ ] Thank everyone who contributed  
- [ ] Add learnings to knowledge base
- [ ] Plan next improvement to this runbook

### When We Rollback

- [ ] Celebrate fast recovery (no blame!)
- [ ] Document what we learned
- [ ] Improve guardrails to catch it next time
- [ ] Share learnings with team

---

*"We don't ship perfect code. We ship recoverable code perfectly."*

---

*Runbook Version: 1.0 | Last Updated: [Date] | Next Evolution: After [X] releases or first major issue*
