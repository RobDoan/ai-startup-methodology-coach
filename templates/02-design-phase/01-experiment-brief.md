# Experiment Brief: [Name of Experiment]

**Owner:** [Product Manager Name]
**Status:** [Draft | In Review | Approved | Running | Concluded]
**Last Updated:** [Date]
**Red Team Review:** [Not Required | Scheduled | Completed]
**Craftsmanship Debt Score:** [1-5 | TBD]

---

## Our Philosophy on Experimentation

> 🔬 **We ship experiments, not features.** Every experiment is a question, not a statement. We're as excited to invalidate our hypothesis as to confirm it—both are learning, and learning is winning.

> 💀 **Killing an idea early is success, not failure.** If this experiment fails, we'll quantify exactly how much time and money we saved by not building the wrong thing.

---

## Executive Summary

**The Question We're Answering:** [One sentence. What do we need to learn?]  
**Why This Matters Now:** [Why can't this wait? What decision is blocked?]  
**Cost to Test:** [Time: X days, Money: $Y, Debt Score: Z]  
**Cost of Being Wrong:** [What happens if we don't test and build the wrong thing?]  
**Kill Date:** [When do we decide, no matter what?]

---

## 1. The Core Assumption

**What is the single riskiest belief we hold that, if wrong, would cause this entire initiative to fail?**

> *[State the assumption clearly. e.g., We believe our target users are willing to pay for a standalone version of our reporting feature.]*

**Type of Assumption:** [ ] Problem / [ ] Solution / [ ] Usability / [ ] Technical / [ ] Business Model

---

## 2. The Hypothesis

**How will we test this assumption? Frame it as a falsifiable If/Then statement.**

**If we** [build/do X minimal thing],
**Then we expect** [Y user behavior]
**Because** [of Z reason].
**We'll know this is true when we see** [a specific, measurable outcome].

> *Example: **If we** create a simple landing page for a "Pro Reporting" plan and add a "Upgrade" CTA in the app, **Then we expect** users to click the CTA and enter their email on the landing page, **Because** they have repeatedly asked for more advanced reporting. **We'll know this is true when we see** a 5% click-to-email conversion rate from active users within 7 days.*

---

## 3. Kill Criteria & Pre-Mortem (Our Defense Against Wishful Thinking)

### We will IMMEDIATELY STOP this experiment if

* **Primary Kill Trigger:** [Specific measurable outcome that proves we're wrong. e.g., "Conversion rate < 1% after 100 users"]
* **Guardrail Breach:** [Critical metric that can't degrade. e.g., "Core feature usage drops >10%"]
* **Time Box Exceeded:** [Maximum learning period. e.g., "No signal after 14 days"]
* **Resource Threshold:** [Cost limit. e.g., "Experiment costs exceed $1000 in infrastructure"]

### Pre-Mortem: Why This Will Probably Fail

*Imagine it's 2 weeks from now and this experiment failed spectacularly. What happened?*

1. **Most Likely Failure:** [e.g., "Users don't actually have this problem - we projected our own needs"]
2. **Second Most Likely:** [e.g., "The problem exists but our solution doesn't address it"]
3. **Hidden Risk:** [e.g., "This breaks an existing workflow we didn't consider"]

**If these failures happen, we will have learned:** [What valuable insight comes from failure]

---

## 4. The Experiment Design (The "Good Enough" Solution)

**What is the absolute minimum we need to build to generate a reliable signal for our hypothesis?**

* **Key Action/Feature:** [Describe the minimal feature, e.g., "A fake door 'Upgrade' button and a Typeform landing page."]
* **Target Audience:** [Who will see this? e.g., "All users on the free plan who have created >10 reports."]
* **Explicitly NOT Building:** [What we are consciously leaving out to maintain speed, e.g., "Actual payment processing, multiple pricing tiers, a feature tour."]

---

## 5. Learning & Next Actions

**What will we do based on the outcome? This forces us to have a plan for all results.**

* **If Validated (Success):**
  * **What We Learned:** [e.g., "The assumption that users have a strong intent to pay was proven correct."]
  * **Investment Justified:** [e.g., "This validates spending 6 weeks building the full payment system"]
  * **Next Action:** [e.g., "Greenlight the development of a real billing system and the V1 of the Pro plan."]
  * **Debt Paydown Plan:** [If debt score > 2, when and how will we harden this?]

* **If Invalidated (Failure = Learning Victory):**
  * **What We Learned:** [e.g., "Users don't value premium reporting enough to pay"]
  * **The Victory - Time Saved:** [e.g., "6 weeks of engineering time = ~$30,000"]
  * **The Victory - Opportunity Cost:** [e.g., "Can now focus on the real problem: data export"]
  * **The Victory - Strategic Learning:** [e.g., "Our users are cost-sensitive hobbyists, not professionals"]
  * **Next Action:** [e.g., "Interview 5 users who ignored the feature to understand their actual needs"]
  * **Celebration:** [e.g., "Nominate for Failure of the Month Award with $30K saved as headline"]

---

## 6. Quality & Speed Trade-offs

**Craftsmanship Debt Assessment:**

* **Proposed Debt Score:** [1-5, see ../00-cross-cutting/craftsmanship-debt-tracker.md for rubric]
* **Justification:** [Why this level of debt is appropriate for this experiment]
* **Maximum Duration at This Debt Level:** [How long can this run before hardening?]
* **Hardening Trigger:** [What success metric triggers immediate debt paydown?]

---

## 7. Red Team Requirements

**Does this experiment need Red Team review?**

* [ ] Affects >1000 users → Red Team Required
* [ ] >$10K investment → Red Team Required  
* [ ] Strategic direction change → Red Team Required
* [ ] None of the above → Red Team Optional

**If Required:**

* **Red Team Members:** [Assigned by Data Science Lead]
* **Review Date:** [Within 48 hours of request]
* **Key Concerns to Address:** [What you want Red Team to focus on]

---

**Connected Documents:**

* `02-user-journey-map.md`
* `03-prototype-spec.md`
* `04-tech-feasibility-check.md`
* `../00-cross-cutting/craftsmanship-debt-tracker.md`
* `../00-cross-cutting/red-team-review.md`
