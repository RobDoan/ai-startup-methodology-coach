# Craftsmanship Debt Tracker

**Purpose:** To make the cost of speed visible and prevent the "Learning Loophole" where experimentation becomes an excuse for shipping garbage.  
**Owner:** Engineering Lead + Product Manager (jointly responsible)  
**Review Cadence:** Weekly during team sync

---

## Our Philosophy on Technical Debt

> 🎯 **Speed without craft is not velocity—it's recklessness.** We embrace conscious trade-offs, not unconscious corner-cutting. Every experiment that touches production must acknowledge its debt. There is no shame in taking on debt; there is shame in hiding it.

> **The Learning Loophole closes here.** "It's just an experiment" is never an excuse for unprofessional work. We track debt not to punish, but to make informed decisions about when to pay it down.

---

## Active Experiments & Their Debt

| Experiment | Debt Score | Owner | Date Added | Hardening ETA | Business Justification |
|------------|------------|-------|------------|---------------|------------------------|
| Payment flow A/B test | 3 | @jane | 2024-01-15 | Sprint 3 | Testing willingness to pay |
| Mobile onboarding | 4 | @alex | 2024-01-20 | Sprint 4 | 60% of users on mobile |
| Referral system | 2 | @sam | 2024-01-22 | Post-validation | Low-risk feature flag |

---

## Debt Scoring Rubric (1-5)

### Score 1: Production-Ready

- Fully tested (>80% coverage)
- Proper error handling
- Monitoring in place
- Documentation complete
- **Can run indefinitely without intervention**

### Score 2: Minor Polish Needed

- Core functionality solid
- Missing edge case handling
- Basic monitoring only
- **Could run for months with minimal issues**

### Score 3: Acceptable Experiment

- Happy path works reliably
- Limited error handling
- Basic logging only
- Manual processes acceptable
- **Safe for 2-4 week experiment**

### Score 4: Minimum Viable Hack

- Core feature barely works
- No error handling
- Hard-coded values
- Manual intervention likely needed
- **Maximum 1 week in production**

### Score 5: Duct Tape & Prayer

- Proof of concept quality
- Will break under load
- No monitoring/logging
- Requires constant babysitting
- **Should never touch real users**

---

## Debt Accumulation Rules

### 🚨 MANDATORY HARDENING TRIGGERS

**Team Debt Ceiling: 15 points total**

- If total debt > 15: Next sprint MUST be hardening sprint
- No new experiments until debt < 10

**Individual Experiment Triggers:**

- Score 5 debt: 48 hours maximum in production
- Score 4 debt: 1 week then mandatory review
- Experiment succeeds + debt > 3: Immediate hardening before scaling

### ⚠️ Weaponization Prevention

**Good Faith vs Bad Faith Scoring:**

| Situation | Bad Faith (Weaponized) | Good Faith (Intended) |
|-----------|------------------------|----------------------|
| Assigning Score 5 | "This code I don't like is debt" | "This will break under normal load" |
| Demanding perfection | "Everything should be Score 1" | "Customer-facing features need Score ≤2" |
| Avoiding hardening | "We'll fix it later" (never happens) | "Scheduled for Sprint X with ticket #" |

---

## Monthly Debt Report

**Total Debt Points:** [Sum]  
**Debt Velocity:** [Points added - Points resolved]  
**Oldest Unresolved Debt:** [Experiment name, age in days]  

### Debt Resolution This Month

- ✅ Checkout flow: Reduced from 4 → 2 (added proper error handling)
- ✅ Analytics pipeline: Reduced from 3 → 1 (automated manual processes)
- ❌ Email system: Still at 4 (deprioritized for new feature)

### Learning: What Debt Taught Us

*What did we learn by consciously taking on debt? What would have happened if we'd built "properly" from the start?*

Example: "Taking on Score 4 debt for the referral test saved 3 weeks. Test failed in 2 days. Saved 18 developer-days by not building it 'right.'"

---

## The Hardening Sprint Ritual

When debt ceiling is hit, we run a Hardening Sprint:

1. **No new features** (leadership must support this)
2. **Pick top 3 debt items** by (Risk × Usage)
3. **Goal: Reduce total debt by 40%**
4. **Celebrate the craft** - This is professional pride, not punishment

### Hardening Sprint Outcomes Log

| Sprint | Before | After | Key Improvements | Time Saved Long-term |
|--------|--------|-------|------------------|---------------------|
| 2024-Q1 | 18 pts | 8 pts | Error handling, monitoring | ~5 hrs/week support |

---

## Red Flags: When Debt Becomes Dysfunction

🚩 Same experiment at Score 4+ for over a month  
🚩 "Temporary" hacks that become permanent  
🚩 Hardening sprints consistently skipped  
🚩 Debt scores consistently gamed or argued  
🚩 "We don't have time to fix it" becomes the norm

**If you see these patterns, escalate to leadership. The culture is rotting.**

---

## Remember

> "Technical debt is like financial debt—powerful when used strategically, destructive when ignored."

**Debt is a tool, not a lifestyle.** Use it wisely.

---

*Template Version: 1.0 - Closing the Learning Loophole*  
*Based on Learning Machine Manifesto Principle: "Seek Velocity, Not Perfection" + Safeguards*
