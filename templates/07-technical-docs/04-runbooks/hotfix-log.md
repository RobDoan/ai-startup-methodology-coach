# Hotfix Log: Emergency Changes Record

> **For when the building is on fire and processes must bend.**  
>
> This captures the "why" of emergency changes without the full experimental overhead.

## Our Philosophy

Sometimes you need to break glass. This log ensures we capture the essential context of emergency changes without getting tangled in bureaucracy when every minute counts.

**Principle:** "Document the emergency, learn from the emergency, prevent the next emergency."

---

## Active Hotfixes

### 🚨 [HOTFIX-001] [Brief Description]

**Date/Time:** [YYYY-MM-DD HH:MM]  
**Severity:** 🔴 Critical | 🟡 High | 🔵 Medium  
**Duration:** [How long to implement]  
**Who:** [Person who made the change]

#### The Emergency

**Problem:** [What was broken/failing]  
**Impact:** [How many users affected, business impact]  
**Why Emergency:** [Why normal process couldn't wait]

#### The Fix

**Change Made:** [Brief description of what was changed]  
**Files/Systems Affected:** [What was touched]  
**Rollback Plan:** [How to undo if it makes things worse]

#### The Context

**Root Cause (Initial):** [Best guess at cause]  
**Risk Accepted:** [What corners were cut, what wasn't tested]  
**Monitoring:** [What metrics to watch post-fix]

#### Follow-up Required

- [ ] **Post-mortem scheduled** for [Date] with [People]
- [ ] **Proper fix planned** - [Brief description]  
- [ ] **Process improvement** - [What should prevent this]
- [ ] **Documentation updates** - [What docs need updating]

---

## Completed Hotfixes (Last 6 Months)

### 🚨 [HOTFIX-XXX] [Brief Description] - [Date]

**Duration:** [Time to fix] | **Follow-up:** [Status] | **Learning:** [Key insight]

**Post-mortem:** [Link to full analysis]

---

## Hotfix Patterns & Prevention

### Common Emergency Types

- **Type 1:** [e.g., Database connection failures] - **Prevention:** [Strategy]
- **Type 2:** [e.g., Third-party API outages] - **Prevention:** [Strategy]  
- **Type 3:** [e.g., Memory leaks under load] - **Prevention:** [Strategy]

### Warning Signs

*Metrics/behaviors that predict emergencies:*

- **Signal 1:** [Metric/behavior] → **Threshold:** [When to act]
- **Signal 2:** [Metric/behavior] → **Threshold:** [When to act]
- **Signal 3:** [Metric/behavior] → **Threshold:** [When to act]

---

## Emergency Response Playbook

### Decision Tree: Is This Really a Hotfix?

```
Is production down or severely degraded? ─── No ──→ Use normal process
            │
           Yes
            │
Can it wait 2-4 hours? ─── Yes ──→ Use expedited PR process  
            │
           No
            │
   HOTFIX APPROVED ──→ Proceed with emergency process
```

### Hotfix Process (5 minutes)

1. **🚨 Alert Team** - Post in #incidents channel
2. **📝 Start Log Entry** - Copy this template, fill basics
3. **🔧 Make Minimal Change** - Smallest possible fix
4. **👀 Get Quick Review** - Slack/call one senior person
5. **🚀 Deploy with Monitoring** - Watch metrics closely
6. **📋 Complete Log Entry** - Document what happened

### Post-Hotfix (24 hours)

- **Schedule post-mortem** within 48 hours
- **Plan proper fix** that addresses root cause
- **Update monitoring** to catch this pattern earlier
- **Review process** - should this have been predictable?

---

## Communication Templates

### Incident Alert (Slack)

```
🚨 HOTFIX IN PROGRESS 🚨
Issue: [Brief description]
Impact: [User/business impact] 
ETA: [Expected time to resolution]
Owner: [Who's fixing it]
Tracking: HOTFIX-[XXX]
```

### Hotfix Complete (Slack)

```
✅ HOTFIX DEPLOYED ✅
Issue: [Brief description] 
Fix: [What was changed]
Monitoring: [What to watch]
Next: [Post-mortem/proper fix plan]
Log: [Link to this entry]
```

### Stakeholder Update (Email)

```
Subject: Production Issue Resolved - [Brief Description]

Issue: [What happened and when]
Impact: [Effect on users/business]
Resolution: [How it was fixed]
Prevention: [Steps being taken to prevent recurrence]
Timeline: [Key timestamps of incident]

Next steps:
- Post-mortem scheduled for [Date]
- Permanent fix planned for [Timeline]
- Process improvements being implemented
```

---

## Success Metrics

### Response Time

- **Detection to alert:** Target <5 minutes
- **Alert to fix deployed:** Target <30 minutes  
- **Total incident duration:** Target <60 minutes

### Learning Velocity

- **Post-mortems completed:** 100% within 48 hours
- **Prevention rate:** [X]% of similar incidents prevented
- **Process improvements:** [X] improvements per quarter

### Team Health

- **Hotfix frequency:** Trending down month over month
- **Repeat incidents:** <10% of total incidents
- **Team confidence:** High comfort with emergency procedures

---

## Related Documentation

- **[Risk Register](../learning/risk-register.md)** - Track systemic risks that could cause emergencies
- **[Release Runbook](release-runbook.md)** - Normal deployment process we bypass in emergencies  
- **[Learning Library](../learning/learning-library.md)** - Capture insights from post-mortems

---

## Evolution Notes

### Template Improvements

*How this log format should improve based on usage:*

- **Add:** [Suggestions for new fields/sections]
- **Remove:** [Fields that aren't useful in practice]
- **Streamline:** [Ways to make this faster to fill out]

### Process Improvements

*How our emergency response should evolve:*

- **Automation:** [Things that could be automated]
- **Prevention:** [Early warning systems to build]
- **Communication:** [Better ways to keep stakeholders informed]

---

*"In the midst of chaos, there is also opportunity." - Sun Tzu*

---

*This log exists because sometimes the documentation process must bend to reality, but learning must never break.*
