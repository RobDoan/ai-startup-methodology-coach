# Tech Feasibility Check: [Name of Experiment]

**Purpose:** Final engineering validation that the prototype from `03-prototype-spec.md` can be built safely and quickly. This follows the initial `00-tech-spike-check.md` if one was needed.

**Engineer:** [Engineer Name]
**Date:** [Date]
**Spike Completed:** [ ] N/A - No spike needed / [ ] Yes - Results incorporated / [ ] No - Proceeding with risk

---

## 1. Technical Spike Results (If Applicable)

**Was a technical spike performed?**

- [ ] No spike was needed (trivial implementation)
- [ ] Yes, spike completed successfully
- [ ] Yes, spike revealed issues but we found workarounds
- [ ] No, but one was recommended (proceeding at risk)

**If spike was done, key findings:**

- **What we learned:** [Key technical insights]
- **What changed:** [How this affected our approach]
- **Remaining unknowns:** [What we're still uncertain about]

---

## 2. The Build: Final Assessment

- **Can we build this using existing components/UI patterns?**
  - [ ] Yes / [ ] Mostly / [ ] No, this requires significant new UI.
  - *Notes:*

- **Are there any new backend services or complex data models required?**
  - [ ] No, this is frontend-only or uses existing endpoints.
  - [ ] Yes, and here's the minimal change needed:
  - *Notes:*

- **How will we track the success metric from the `01-experiment-brief.md`?**
  - [ ] With existing analytics events.
  - [ ] We need to add one new event: `[event_name]`
  - *Notes:*

---

## 3. Progressive Complexity Check

**If this experiment succeeds, what's the REAL complexity of making it production-ready?**

| Component | Experiment Version | Production Version | Multiplier |
|-----------|-------------------|-------------------|------------|
| Frontend | [e.g., "Static HTML"] | [e.g., "React components"] | [e.g., "3x"] |
| Backend | [e.g., "Hardcoded"] | [e.g., "Dynamic API"] | [e.g., "5x"] |
| Data/Analytics | [e.g., "Basic events"] | [e.g., "Full funnel"] | [e.g., "2x"] |
| **Total Effort** | **[X days]** | **[Y days]** | **[Z times harder]** |

**Warning flags:**

- [ ] Experiment version creates technical debt we can't easily remove
- [ ] Production version requires architectural changes
- [ ] Experiment success would create immediate scaling issues

---

## 4. The Release: Safety Checklist

- **Can this be deployed behind a feature flag?**
  - [ ] Yes / [ ] No

- **Does this experiment depend on any other work in progress?**
  - [ ] No / [ ] Yes, it depends on:

- **Is there any risk to existing users or system performance?**
  - [ ] No / [ ] Yes, here's the risk:

- **If the experiment fails, how quickly can we remove it?**
  - [ ] Instantly (disable feature flag).
  - [ ] Requires a new deployment.

---

## 5. The Verdict

- **Rough Time Estimate (Dev work only):**
  - [ ] < 1 day
  - [ ] 1-3 days
  - [ ] > 3 days *(This might be too big for a simple experiment!)*

- **Overall Assessment:**
  - [ ] **Green:** This is a simple, safe experiment. Let's do it.
  - [ ] **Yellow:** This is doable, but has some complexity we should discuss.
  - [ ] **Red:** This is much bigger than a simple experiment. We need to simplify the prototype.

---

**Connected Documents:**

- `00-tech-spike-check.md` (if spike was needed)
- `01-experiment-brief.md`
- `03-prototype-spec.md`

---

## Appendix: When to Use Which Document

1. **Start with `00-tech-spike-check.md`** when the idea is first proposed (5 min)
2. **Run technical spike** if unknowns identified (2 hours - 2 days)
3. **Create `01-experiment-brief.md`** once technical path is clear
4. **Complete this `04-tech-feasibility-check.md`** after prototype is designed (15 min)

This ensures technical constraints are discovered early, not after significant design work.
