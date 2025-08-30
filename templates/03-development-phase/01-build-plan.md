> **Our Engineering Philosophy:** This document is a compass, not a map. Its purpose is to align on the "why" and the high-level "what." It is not a project plan. We expect the details to change as we learn. We value clear goals and conscious trade-offs over rigid plans.

> **Remember:** We're building to learn, not to last. Every line of code is a hypothesis. Be proud of your craft, but don't fall in love with your code. An experiment is not an excuse for sloppy work—it's permission to make conscious trade-offs.

# Build Plan: [Feature/Experiment Name]

**Owner:** [Tech Lead] | **Status:** In Progress  
**Link to Experiment Brief:** [URL] | **Link to Epic:** [URL to Jira/Linear]  
**Craftsmanship Debt Score:** [1-5] | **Red Team Review:** [Yes/No/NA]  
**Experiment Type:** [Learning / Scaling / Hardening]

## 1. Hypothesis & Goal

- **Hypothesis:** We believe that [specific assumption]
- **Success Metric:** ...and we'll know we're right if [Metric] hits [Target]
- **Kill Criteria:** We'll stop immediately if [specific measurable threshold]
- **Learning Goal:** We want to learn [specific unknown]

## 2. Technical Approach

### What We're Building

- **Core Functionality:** [The minimum that must work]
- **User Path:** [The exact flow we're testing]
- **Architecture Choice:** [Why this approach vs. alternatives]

### Conscious Trade-offs (The Debt We're Taking)

| What We're NOT Doing | Why | Debt Score | Payback Plan |
|---------------------|-----|------------|--------------|
| Proper error handling | Fast validation | 3 | Add if >100 users |
| Admin tools | Manual is fine for experiment | 2 | Build if successful |
| Scale beyond 1000 users | Testing with 100 first | 4 | Architecture ready |

**Total Debt Points:** [Sum]  
**Team Debt Ceiling:** 15 points (current total: [X])

### What MUST Work Well

- [ ] Core happy path (no exceptions)
- [ ] Rollback mechanism
- [ ] Basic monitoring
- [ ] Data collection for learning

## 3. Build Phases

### Phase 1: Minimum Testable (Days 1-3)

- [ ] Core feature working locally
- [ ] Basic happy path test
- [ ] Feature flag implemented
- [ ] Rollback tested

### Phase 2: Experiment Ready (Days 4-5)

- [ ] Deployed to staging
- [ ] Monitoring dashboard ready
- [ ] Analytics events verified
- [ ] Red Team review (if required)

### Phase 3: Learning Mode (Days 6+)

- [ ] Progressive rollout (10% → 50% → 100%)
- [ ] Daily metric reviews
- [ ] Quick iterations based on data
- [ ] Decision point scheduled

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation | Rollback? |
|------|------------|--------|------------|-----------|
| Performance degrades | Medium | High | Monitor P95 latency | < 5 min via flag |
| Data collection fails | Low | High | Verify before launch | Replay from logs |
| Users hate it | Unknown | Medium | Fast user feedback | < 5 min via flag |

### Rollback Plan

- **Trigger:** [Specific metrics that trigger rollback]
- **Method:** Feature flag / Deployment revert
- **Command:** `[exact command to execute]`
- **Time to Execute:** < 5 minutes
- **Verification:** `[command to verify rollback success]`

## 5. The Weaponization Check

Are we using "experimentation" to justify:

- [ ] Shipping broken code? (No - core path must work)
- [ ] Avoiding hard problems? (No - addressing the core risk)
- [ ] Delaying decisions? (No - clear success criteria)
- [ ] Looking busy vs. learning? (No - specific hypothesis)

**If any are checked, STOP. Redesign the experiment.**

## 6. Success Criteria & Next Steps

### If Successful (Metric > Target)

1. Immediate: Celebrate the learning
2. Next Sprint: Pay down debt to score ≤ 2
3. Then: Scale to broader audience

### If Failed (Metric < Target)

1. Immediate: Kill it (no sunk cost fallacy)
2. Document: Add to Learning Library
3. Nominate: Failure of the Month Award

### If Inconclusive (Close to Target)

1. Extend: One more week maximum
2. Modify: Adjust one variable
3. Decide: Ship, kill, or pivot

## 7. Learning Extraction Plan

**We will know we've learned something when we can answer:**

- [ ] Was our hypothesis correct? (Yes/No/Partially)
- [ ] What surprised us?
- [ ] What would we do differently?
- [ ] What's the next hypothesis?

## 8. The Engineer's 3 AM Test

Before shipping, you must be able to answer:

1. **What breaks if this fails?**
2. **How do we roll back in 5 minutes?**
3. **What debt are we creating?**
4. **Are we learning or just shipping?**
5. **Would I deploy this on Friday at 5 PM?**

## 9. Dependencies & Blockers

- **Needs from Other Teams:** [List with owners]
- **External Dependencies:** [APIs, services, etc.]
- **Blockers:** [What could stop us]

## 10. Links & Resources

- **Experiment Brief:** [Link]
- **Craftsmanship Debt Entry:** [../00-cross-cutting/craftsmanship-debt-tracker.md]
- **Red Team Review:** [../00-cross-cutting/red-team-review.md if applicable]
- **Crisis Framework:** [../00-cross-cutting/crisis-decision-framework.md]
- **Monitoring Dashboard:** [Pre-configured link]
- **Analytics Events:** [Documentation]
- **Rollback Runbook:** [Link]

---

**Remember the Mindset:**
> "We don't build products; we test assumptions.  
> We don't avoid failure; we seek truth.  
> Speed of learning is our primary metric of progress."

---

*Template Version: 2.0 - Aligned with Learning Machine Manifesto*
