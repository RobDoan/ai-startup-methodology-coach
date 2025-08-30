# Development Workflow: The Build-Measure-Learn Loop

> **Our development process is our learning engine.**
>
> Every commit, every PR, every deploy is part of a continuous learning cycle.

## Our Philosophy

We don't just build features—we run experiments. Our development workflow is designed to maximize learning velocity while maintaining code quality. Every step should either generate insights or enable faster iteration.

**Core Principle:** "Ship to learn, learn to ship better."

---

## 🔄 The Core Loop

```
   Hypothesis 
       ↓
   Quick Build 
       ↓
   Fast Deploy
       ↓
   Measure Impact
       ↓
   Learn & Iterate
       ↑
       |
   [Loop back to new hypothesis]
```

**Target Cycle Time:** Idea → Production → Learning in <[X] days

---

## 🧪 Starting with Hypotheses

### Before You Code

**Every feature starts with an experiment brief:**

1. **Create experiment brief** using [template](../experiments/experiment-brief.md)
2. **Define success criteria** BEFORE building anything
3. **Set kill criteria** - when would we stop this work?
4. **Estimate debt score** - how production-ready does this need to be?

### Branch Naming Convention

```
experiment/[brief-name] - for new hypothesis testing
feature/[feature-name]  - for validated experiments  
fix/[issue-description] - for bug fixes
debt/[improvement]      - for technical debt work
```

---

## 💻 Development Phase

### Code Quality Standards

#### Must Haves (Non-negotiable)

- [ ] **Tests pass** locally before pushing
- [ ] **Linting rules** followed (automated)
- [ ] **Security standards** met (no secrets, input validation)
- [ ] **Performance** doesn't regress significantly

#### Should Haves (Reviewer judgment)

- [ ] **Code readability** - clear variable/function names
- [ ] **Test coverage** of new logic
- [ ] **Documentation** updated if needed
- [ ] **Debt score** honestly assessed

#### Nice to Haves (Time permitting)

- [ ] **Performance optimization** beyond baseline
- [ ] **Code elegance** and perfect architecture
- [ ] **Comprehensive edge case handling**

### Debt Score Guidelines

**Rate every experiment/feature 1-5:**

- **1 - Throwaway Prototype:** Working but fragile, not production-ready
- **2 - Quick Experiment:** Basic error handling, minimal tests
- **3 - Production Beta:** Core functionality solid, some edge cases unhandled  
- **4 - Production Ready:** Robust error handling, good test coverage
- **5 - Bulletproof:** Comprehensive tests, monitoring, documentation

---

## 🔍 Pull Request Process

### PR Title Format

```
[EXPERIMENT] - Brief hypothesis and expected learning
[FEATURE] - Validated feature based on experiment results
[FIX] - Bug description and impact
[DEBT] - Technical improvement and motivation
```

### PR Description Template

```markdown
## What & Why
**Problem:** [What problem does this solve?]
**Solution:** [How does this solve it?]
**Learning Goal:** [What will this teach us?]

## Hypothesis  
**We believe:** [Core assumption being tested]
**Success looks like:** [Specific metrics/behaviors]
**Failure looks like:** [What would invalidate this]

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass  
- [ ] Manual testing completed
- [ ] Performance impact assessed
- [ ] Tests align with our [Testing Manifesto](testing-manifesto.md)

## Deployment
**Debt Score:** [1-5] - [Brief justification]
**Rollback Plan:** [How to undo this change]
**Monitoring:** [What metrics to watch post-deploy]

## Related
- **Experiment Brief:** [Link if applicable]
- **ADR:** [Link if architectural decision made]
- **Previous Work:** [Links to related PRs/issues]
```

### Review Process

#### Reviewers Look For

1. **Correctness:** Does the code do what it claims?
2. **Safety:** Can this break existing functionality?
3. **Learnability:** Will this generate useful data/insights?
4. **Maintainability:** Can the team work with this code?

#### Review Timeline

- **Small PRs (<200 lines):** 24-hour review target
- **Medium PRs (200-500 lines):** 48-hour review target  
- **Large PRs (>500 lines):** Break into smaller PRs when possible

---

## 🚀 Deployment Strategy

### Deployment Types

#### 🧪 Experimental Deployments

- **Feature flags enabled** for gradual rollout
- **A/B testing setup** with control groups
- **Enhanced monitoring** for experiment metrics
- **Quick rollback** capability confirmed

#### 🏗️ Standard Deployments  

- **Blue-green deployment** for zero-downtime updates
- **Automated health checks** post-deployment
- **Standard monitoring** for performance/errors
- **Rollback triggers** defined and tested

#### 🚨 Hotfix Deployments

- **Fast-track process** for critical issues
- **Minimal review** (focus on safety over perfection)
- **Immediate verification** post-deploy
- **Post-mortem** scheduled within 24 hours

### Deployment Checklist

- [ ] **Tests passing** in CI/CD
- [ ] **Feature flags configured** (if needed)
- [ ] **Monitoring dashboards** ready
- [ ] **Team notified** in #releases
- [ ] **Rollback plan** confirmed
- [ ] **Success criteria** defined

---

## 📊 Measurement Phase

### Immediate Post-Deploy (0-30 minutes)

- **Technical metrics:** Error rates, response times, resource usage
- **Business metrics:** Core user actions, conversion rates
- **User experience:** Are users able to complete key flows?

### Short-term Monitoring (1-7 days)

- **Experiment metrics:** A/B test results, feature flag performance  
- **Regression detection:** Are existing features still working?
- **User feedback:** Support tickets, user research insights

### Long-term Analysis (1-4 weeks)

- **Business impact:** Revenue, retention, engagement changes
- **Technical performance:** System stability, scalability impact
- **Learning validation:** Did we prove/disprove our hypothesis?

---

## 🎓 Learning Phase

### Experiment Conclusion Process

#### Data Analysis

- **Separate observations from interpretations**
- **Use pre-defined analysis segments** to avoid p-hacking
- **Calculate statistical significance** where applicable
- **Document unexpected findings**

#### Decision Making

**Based on experiment results:**

- **Kill:** Remove feature, document learnings in [Learning Library](../learning/learning-library.md)
- **Iterate:** Modify based on learnings, run new experiment
- **Scale:** Roll out to all users, plan next optimization  
- **Pivot:** Change direction based on insights

#### Knowledge Capture

- **Update experiment brief** with results
- **Add learnings to** [Learning Library](../learning/learning-library.md)
- **Share insights** with broader team
- **Identify next hypotheses** for testing

---

## 🎯 Workflow Success Metrics

### Velocity Metrics

- **Cycle Time:** Idea → Production → Learning
  - Current: [X] days
  - Target: <[Y] days
  - Trend: [Improving/Stable/Declining]

- **Deployment Frequency:**
  - Current: [X] deploys/week
  - Target: >[Y] deploys/week
  - Quality: <[Z]% rollback rate

### Learning Metrics

- **Experiment Success Rate:** [X]% of experiments generate actionable insights
- **Hypothesis Validation:** [X]% of hypotheses confirmed/invalidated
- **Knowledge Reuse:** [X]% of learnings influence future decisions

### Quality Metrics

- **Bug Escape Rate:** <[X]% of releases require hotfixes
- **Customer Impact:** <[X] minutes average downtime per month
- **Team Confidence:** [X]/5 confidence in deployment process

---

## 🛠️ Tools & Automation

### Development Tools

| Tool | Purpose | Automation Level | Team Satisfaction |
|------|---------|------------------|-------------------|
| **[IDE/Editor]** | Code writing | Extensions configured | [X]/5 |
| **[Version Control]** | Code history | Auto-merge/deployment | [X]/5 |
| **[CI/CD Platform]** | Build/test/deploy | Fully automated | [X]/5 |
| **[Feature Flags]** | Gradual rollouts | API integrated | [X]/5 |

### Monitoring & Analytics

- **Application Performance:** [Tool name] - automated alerts
- **Business Metrics:** [Analytics platform] - real-time dashboards  
- **User Behavior:** [User tracking] - experiment analysis
- **System Health:** [Infrastructure monitoring] - incident response

---

## 🔄 Workflow Evolution

### Weekly Team Retrospective

**Questions we ask:**

- What slowed us down this week?
- What helped us learn faster?  
- Which part of the process felt wasteful?
- What experiments taught us the most?

### Monthly Process Review

- **Cycle time analysis:** Where do we spend the most time?
- **Quality trends:** Are we maintaining standards while moving fast?
- **Learning velocity:** Are we getting smarter faster?
- **Tool effectiveness:** What's helping/hindering our work?

### Quarterly Workflow Experiments

We treat our own workflow as an experiment:

- **Hypothesis:** [Process change] will improve [specific metric]
- **Success criteria:** [X]% improvement in [metric] over [timeframe]  
- **Kill criteria:** If no improvement after [timeframe], revert

---

## 🎉 Celebrating Learning

### Daily Wins

- **Share experiment results** in team updates
- **Highlight fast learning cycles** completed
- **Recognize good failure** (saved time/money)
- **Thank reviewers** who caught issues

### Weekly Recognition

- **"Fastest Learner" award** - quickest hypothesis validation
- **"Best Failure" award** - most valuable invalidated assumption
- **"Smoothest Deploy" award** - seamless production release
- **"Code Quality" award** - excellent PR review feedback

---

## 🔗 Connected Documents

This workflow integrates with:

- **[Experiment Brief Template](../experiments/experiment-brief.md)** - Starting point for all features
- **[Release Runbook](../runbooks/release-runbook.md)** - Deployment procedures
- **[Learning Library](../learning/learning-library.md)** - Where insights are captured
- **[Testing Manifesto](testing-manifesto.md)** - Quality standards
- **[Tech Stack](../systems/tech-stack.md)** - Tools and technologies used

---

*"We optimize for learning speed, not just shipping speed."*

---

*Last Updated: [Date] | Next Evolution: Based on team velocity metrics and satisfaction surveys*
