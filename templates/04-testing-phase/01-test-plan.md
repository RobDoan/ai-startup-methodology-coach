# Test Plan

## Our Testing Manifesto

> This document is a tool for learning, not just for winning. Our goal is to make smart bets and accelerate our understanding of our users. We value intellectual honesty, and we celebrate learning from our results, especially when they prove us wrong.

> - **An invalidated hypothesis is a success.** It has saved us from investing in the wrong thing. We celebrate the learning.
> - **We are skeptical of our own ideas.** The purpose of a test is to try to *kill* our idea, not to confirm it. The null hypothesis is our default assumption.
> - **We commit to our decisions upfront.** This framework protects us from our own biases. We will honor the outcome we agreed to.

---

**Purpose:** Define the hypothesis, success metrics, and experimental design to enable objective decision-making through controlled testing.

## Test Overview

**Test Name:** [Feature/Experiment Name]  
**Test ID:** [YYYY-MM-DD-XXX]  
**Related Documents:**

- Product Requirements: `../design/prd.md`
- Hypothesis Source: `../research/hypothesis-list.md`
- Previous Tests: [Link to related experiments]

## Hypothesis Framework

### Null Hypothesis (H₀)
>
> **The change we are introducing will have no statistically significant effect on the primary metric.** Our primary goal is to gather enough evidence to confidently reject this statement.

### Alternative Hypothesis (H₁)

**We believe that:** [specific user segment]  
**Will:** [expected behavior change]  
**Because:** [underlying assumption about user needs]  
**Resulting in:** [measurable business outcome]

*Example: We believe that new users will complete onboarding 25% faster because simplified navigation reduces cognitive load, resulting in a 15% increase in Day-1 retention.*

## Success Metrics

### Primary Metric

- **Metric:** [Specific KPI]
- **Business Value Connection:** [Explain how this metric causally links to long-term business value - why this isn't a vanity metric]
- **Current Baseline:** [Current performance]
- **Target (Minimum Detectable Effect):** [Minimum meaningful change, e.g., +5%]
- **Statistical Thresholds:**
  - **Confidence Level:** 95% (p-value < 0.05)
  - **Statistical Power:** 80%

*Example: Click-through rate on the 'upgrade' button connects to business value because it's a leading indicator of premium conversions, which drives LTV. Target: 15% relative improvement with 95% confidence.*

### Secondary Metrics

| Metric | Baseline | Expected Change | Why Track |
|--------|----------|-----------------|-----------|
| [Metric 1] | [Value] | [+/- X%] | [Reason] |
| [Metric 2] | [Value] | [+/- X%] | [Reason] |

### Guardrail Metrics

- **[Critical metric that must not degrade]:** Maximum acceptable decrease: [X%]

## Experimental Design

**Test Type:** [A/B Test / Multivariate / Sequential / etc.]  
**Sample Size Required:** [Number based on power analysis]  
**Test Duration:** [Start Date] to [End Date] ([X days/weeks])  
**Traffic Allocation:** [X% to control, Y% to variant(s)]

### Audience Targeting

- **Include:** [Specific user criteria]
- **Exclude:** [Users to exclude and why]
- **Geographic Scope:** [Regions/countries]
- **Platform:** [Web/Mobile/Both]

### Pre-defined Analysis Segments (Anti-P-Hacking)
>
> **Critical:** State any user segments you plan to analyze *before* the test starts. If a segment is not listed here, it cannot be used to declare victory later.

| Segment | Hypothesis for this Segment | Why We Expect a Difference |
|---------|----------------------------|----------------------------|
| New vs. Returning Users | [Expected effect difference] | [Reasoning] |
| Mobile vs. Desktop | [Expected effect difference] | [Reasoning] |
| [Custom segment] | [Hypothesis] | [Justification] |

*Example: New Users | Stronger positive effect expected | They haven't formed habits around the old interface*

### Variants

1. **Control:** [Current experience description]
2. **Variant A:** [Change description]
3. **Variant B (if applicable):** [Change description]

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | [L/M/H] | [L/M/H] | [Action] |
| [Risk 2] | [L/M/H] | [L/M/H] | [Action] |

## Implementation Checklist

- [ ] Analytics tracking verified
- [ ] Sample size calculator confirmed
- [ ] Randomization logic tested
- [ ] Rollback plan documented
- [ ] Stakeholders notified
- [ ] Test cases documented in `test-case.md`
- [ ] Bug tracking system ready (`bug-tracker.md`)
- [ ] User feedback collection prepared (`user-feedback-log.md`)

## Decision Framework (Pre-commitment)

**If the primary metric for the overall population shows statistically significant improvement ≥ MDE:**

- **Action:** SHIP. Begin phased rollout to 100%

**If the primary metric shows no significant change OR improvement < MDE:**

- **Action:** ABANDON. The change did not meet our success threshold. Analyze secondary metrics and pre-defined segments for learnings only - do not ship

**If a pre-defined segment shows significant improvement but overall population does not:**

- **Action:** ITERATE. Form new targeted hypothesis for that segment and design a new experiment. Do not ship to all users

**If any guardrail metric shows statistically significant degradation:**

- **Action:** HALT & REVERT. Immediate rollback and root cause analysis

## Test Owner

**Lead:** [Name]  
**Analytics Support:** [Name]  
**Engineering Lead:** [Name]  
**Review Date:** [Date for results review]
