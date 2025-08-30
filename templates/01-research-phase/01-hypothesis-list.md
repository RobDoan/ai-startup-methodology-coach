# The Hypothesis Engine

**Purpose:** The single source of truth for what we believe, what we're testing, and what we've learned. This is the log of our journey to Product-Market Fit.  
**Owner:** `[Product Team]`  
**Last Updated:** `[YYYY-MM-DD]`

---

## Our Guiding Principles

> ⚠️ **This document is our defense against wishful thinking.** Its purpose is to accelerate learning by forcing us to be intellectually honest. Speed and decisiveness are paramount. A well-documented failure is more valuable than a poorly-understood success. If a test isn't in here, it didn't happen.

---

## 1. Idea Triage (The "Napkin Sketch" Zone)

*Got a new idea? Drop it here first. No detailed format required. Low friction entry-point. We review this list weekly to promote promising ideas into the backlog.*

- *Idea: What if we used AI to write personalized invoice follow-ups?*
- *Idea: Could we build a community feature for freelancers to share client feedback?*
- *Idea: Test a "pay what you want" model for the first 3 months.*
- *Idea: Integration with Stripe for automatic payment notifications*

---

## 2. Hypothesis Backlog (Prioritized for Action)

*Prioritized by **Risk & Impact**. What's the most important thing to learn next? Don't over-analyze the score; it's a conversation starter.*

**Priority Score = (Impact × Risk) / Effort**

| Priority | Hypothesis | Impact | Risk | Effort | Score | Decision Maker |
|:---:|:---|:---:|:---:|:---:|:---:|:---|
| 1 | Personalized onboarding increases activation 25% | 5 | 4 | 2 | 10 | PM |
| 2 | Mobile app drives 2x engagement | 4 | 5 | 3 | 6.7 | CEO |
| 3 | Freemium tier converts 15% to paid | 4 | 4 | 4 | 4.0 | PM |
| 4 | *[New Hypothesis]* | [1-5] | [1-5] | [1-5] | [Score] | [Owner] |

---

## 3. Active & Recent Experiments

*What we're testing now and what we've just learned. Focus on the DECISION.*

### HYPOTHESIS #3: Remove Payment Wall from Onboarding

- **Status:** ✅ **Concluded**
- **Decision:** 🚀 **Ship & Iterate** - Keep change but fix retention immediately
- **Key Learning:** *Quality vs quantity tradeoff: +73% signups but -11% retention*
- **Evidence:** `[→ Experiment Summary #3]`

<details>
<summary>Click to expand details for Hypothesis #3</summary>

**Hypothesis Statement:**  
**We believe that** removing payment requirement from onboarding  
**For** new users during signup  
**Will achieve** 50% increase in trial signups  
**We will know this is true when** signup completion rate exceeds 60%

**Riskiest Assumption Being Tested:** *Users are avoiding signup primarily due to payment barrier*

**Minimum Viable Test:**

- **Method:** A/B test with 50/50 traffic split
- **Success Criteria:** Primary: >60% completion rate, Guardrail: ≥35% 7-day retention
- **What We're NOT Testing:** Full freemium model implementation

**Results:**

- ✅ Primary metric: 78% completion (+73% vs control)
- ⚠️ Guardrail violated: 31% retention (-11% vs control)

</details>

---

### HYPOTHESIS #4: Interactive Onboarding Checklist

- **Status:** 🟡 **Testing** (Day 3 of 7)
- **Decision:** ⏳ **Awaiting Data**
- **Key Learning:** *Early signs suggest users prefer guided flow*
- **Evidence:** `[→ Live Dashboard Link]`

<details>
<summary>Click to expand details for Hypothesis #4</summary>

**Hypothesis Statement:**  
**We believe that** a 3-step interactive onboarding checklist  
**For** users who sign up without payment info  
**Will achieve** restoration of 7-day retention to 35%  
**We will know this is true when** retention metrics return to baseline

**Riskiest Assumption Being Tested:** *Users need more guidance, not less friction*

**Minimum Viable Test:**

- **Method:** A/B test on no-payment signups only
- **Success Criteria:** Primary: ≥35% 7-day retention, Secondary: ≥80% complete checklist
- **What We're NOT Testing:** Complex gamification or rewards

</details>

---

## 4. The Learning Library (Our Proven Truths)

### ✅ Validated Assumptions (What we know is TRUE)

1. **Assumption:** Users prefer gradual onboarding over upfront configuration.
   - **Evidence:** Hypothesis #2 showed 50% increase in completion with progressive disclosure.
   - **Impact:** Became a core principle of our UX design. All new features use progressive reveal.
   - **Confidence:** HIGH (tested with 500+ users)

2. **Assumption:** Payment speed is a top-3 problem for freelancers.
   - **Evidence:** Problem Validation Sprint - 8/10 interviewees ranked it #1 frustration.
   - **Impact:** Validated our core value proposition. Shapes all marketing messages.
   - **Confidence:** HIGH (validated through interviews + landing page tests)

3. **Assumption:** Mobile usage is critical for our segment.
   - **Evidence:** 60% of user sessions happen on mobile devices.
   - **Impact:** Shifted to mobile-first development approach.
   - **Confidence:** MEDIUM (observational data, not experimentally tested)

### ❌ Invalidated Assumptions (What we know is FALSE - equally valuable!)

1. **Assumption:** Advanced features drive initial adoption.
   - **Evidence:** Hypothesis #1 showed no change in signups despite adding 5 power features.
   - **Impact:** Saved us 3 months of dev time; pivoted to focus on simplicity-first approach.
   - **Learning:** Users need to understand basic value before they care about advanced features.

2. **Assumption:** Enterprise customers will adopt bottom-up.
   - **Evidence:** 0 out of 15 enterprise trials converted after 3 months of testing.
   - **Impact:** Abandoned enterprise strategy, focused 100% on SMB/freelancer market.
   - **Learning:** Enterprise requires top-down sales, different product, different team.

3. **Assumption:** Users will pay immediately if value is clear.
   - **Evidence:** Hypothesis #3 - removing payment barrier increased signups 73%.
   - **Impact:** Implemented freemium tier, changed entire acquisition model.
   - **Learning:** Even when value is clear, users want to "try before they buy."

### ❓ Inconclusive Tests (What we need to re-test)

1. **Test:** Pricing sensitivity experiment
   - **Issue:** Sample size was too small (n=20), high variance in results
   - **Next Action:** Re-run with landing page test targeting 200+ users
   - **Timeline:** Queue for next sprint after current onboarding test

---

## 5. Quick Decision Framework

*Use this when evaluating new hypothesis ideas:*

### The RICE Filter

**Reach:** How many users affected? (1-10)  
**Impact:** How much will it move key metrics? (1-10)  
**Confidence:** How sure are we this will work? (1-10)  
**Effort:** How much work to test? (1-10, lower = less work)

**Score = (Reach × Impact × Confidence) / Effort**

### Red Flags (Skip These Ideas)

🚩 "Users will love this because I love this"  
🚩 "It worked for [successful company], so it'll work for us"  
🚩 "We can't know until we build the full feature"  
🚩 "The data is unclear, but I have a strong feeling"

### Green Lights (Test These Ideas)

✅ Based on direct user feedback or observed behavior  
✅ Addresses a validated pain point  
✅ Can be tested with minimal development  
✅ Has clear success/failure criteria

---

## 6. Team Rituals & Cadence

### Weekly Hypothesis Review (Every Friday, 30 min)

**Attendees:** Product team + key stakeholders  
**Agenda:**

1. Review active test results (10 min)
2. Make Ship/Pivot/Kill decisions (10 min)
3. Select next hypothesis from backlog (10 min)

**Decision Rules:**

- **Ship:** If primary metric hit + guardrails maintained
- **Pivot:** If primary metric missed but learnings suggest iteration
- **Kill:** If primary metric missed + learnings suggest false assumption

### Monthly Learning Review (First Monday, 90 min)

**Attendees:** Full team  
**Agenda:**

1. Review Learning Library additions (30 min)
2. Strategic implications discussion (30 min)
3. Update Lean Canvas based on learnings (30 min)

**Outputs:**

- Updated assumptions in Lean Canvas
- 3-month hypothesis roadmap
- Strategic pivot decisions (if needed)

---

## 7. Experiment Pipeline Health

*Track our learning velocity:*

| Month | Hypotheses Tested | Validated | Invalidated | Inconclusive | Success Rate |
|-------|-------------------|-----------|-------------|--------------|--------------|
| Month 1 | 3 | 1 | 2 | 0 | 33% |
| Month 2 | 5 | 2 | 2 | 1 | 40% |
| Month 3 | 4 | 1 | 3 | 0 | 25% |

**Target Success Rate:** 30-40% *(Too high = not taking enough risks, too low = poor assumptions)*  
**Target Velocity:** 4-6 hypotheses tested per month  
**Average Time to Decision:** 7 days (target: ≤10 days)

---

*"The only way to win is to learn faster than anyone else." - Eric Ries*

*Template Version: 3.0 - Streamlined decision engine with bias protection*
