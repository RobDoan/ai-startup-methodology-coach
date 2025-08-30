# Technical Spike Check: [Experiment Name]

**Purpose:** Ultra-quick (5 min) technical gut check BEFORE writing the experiment brief. Determines if we need a technical spike to validate feasibility.

**Engineer:** [Engineer Name]
**Date:** [Date]
**Time to Complete:** [Should be <5 minutes]

---

## 1. Initial Technical Assessment

**Based on the rough idea/assumption, my immediate technical reaction is:**

[ ] 🟢 **Trivial** - We've done this before, no unknowns
[ ] 🟡 **Standard** - Known patterns with minor variations
[ ] 🟠 **Uncertain** - Has technical unknowns that need investigation
[ ] 🔴 **Complex** - Multiple unknowns or novel technical challenges
[ ] ⛔ **Risky** - Could break existing systems or has major unknowns

---

## 2. Technical Spike Required?

**Do we need a technical spike BEFORE designing the experiment?**

[ ] **No spike needed** - We understand the technical approach
[ ] **Mini spike (2-4 hours)** - Need to validate one specific thing
[ ] **Full spike (1-2 days)** - Multiple unknowns to investigate
[ ] **Research required (3+ days)** - This is not ready for experimentation

### If spike needed, what are we investigating?

**Unknown #1:** [What technical question needs answering?]
**Unknown #2:** [If applicable]
**Unknown #3:** [If applicable]

**Spike Success Criteria:** [What will the spike prove/disprove?]

---

## 3. Early Red Flags

**Technical constraints that could kill this experiment:**

- [ ] Requires integration with external system we don't control
- [ ] Needs access to data we don't have
- [ ] Depends on unproven/new technology
- [ ] Has hard performance requirements
- [ ] Requires significant infrastructure changes
- [ ] Involves security/compliance considerations
- [ ] None of the above

**If checked any above, explain:** [Brief description of the blocker]

---

## 4. Quick Feasibility Paths

**Could we test this assumption WITHOUT building anything?**

- [ ] Use existing tools (Google Forms, Typeform, etc.)
- [ ] Manual process (Wizard of Oz approach)
- [ ] Mockups/prototypes only (InVision, Figma)
- [ ] A/B test with existing features
- [ ] Data analysis of current behavior
- [ ] No, real code required

**If non-code path exists:** [Describe the approach]

---

## 5. Recommendation

**My recommendation to the team:**

[ ] **✅ PROCEED** - Clear technical path, write the experiment brief
[ ] **⏸️ SPIKE FIRST** - Run technical spike, then reassess
[ ] **🔄 RESHAPE** - The assumption is good but approach needs rethinking
[ ] **🚫 STOP** - Technical barriers make this experiment invalid

**One-sentence technical guidance:** [Your key insight for the team]

---

## Next Steps

- **If PROCEED:** Move to `01-experiment-brief.md`
- **If SPIKE:** Create spike ticket with success criteria above
- **If RESHAPE:** Workshop session to find alternative approaches
- **If STOP:** Document learning and find different assumption to test

---

**Note:** This document should be completed BEFORE any other design documents. It's meant to fail fast on technically infeasible ideas.
