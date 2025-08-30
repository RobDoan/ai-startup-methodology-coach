# Red Team Review

**Purpose:** To protect our experiments from our own biases and prevent weaponization of our principles. The Red Team is our intellectual immune system.  
**When to Use:** For any experiment that will affect >1000 users OR >$10K investment OR strategic direction  
**Review Duration:** 60-90 minutes maximum (speed matters)  
**Owner:** Data Science Lead assigns reviewers

---

## Our Philosophy on Intellectual Dissent

> 🎯 **The Red Team's job is to kill your idea, not your spirit.** They attack the hypothesis, not the person. This is an act of love—they're saving you from wasting months on a flawed assumption.

> **Intellectual dissent must be a shared responsibility, not an act of individual courage.** The Red Team structure removes the social cost of challenging ideas. You're not the asshole; you're doing your assigned job.

---

## Red Team Assignment

**Experiment:** [Name and link to experiment brief]  
**Experiment Owner:** [Name - cannot be on Red Team]  
**Red Team Members:** [2 people with no stake in the outcome]  
**Review Date:** [Must be within 48 hours of request]  

### Selection Criteria

- ❌ Cannot be on the team proposing the experiment
- ❌ Cannot benefit from the experiment's success
- ✅ Should have domain knowledge OR methodology expertise
- ✅ Must be willing to be professionally ruthless

---

## Pre-Review: Experiment Owner Provides

1. **Hypothesis:** [Clear, falsifiable statement]
2. **Riskiest Assumption:** [What must be true for this to work]
3. **Success Metrics:** [Primary metric + threshold]
4. **Kill Criteria:** [What would make us stop]
5. **Craftsmanship Debt Score:** [1-5 from debt tracker]

---

## Red Team Review Checklist

### 1. Hypothesis Stress Test

- [ ] **Is the hypothesis actually falsifiable?** Can we prove it wrong?
- [ ] **Is the success metric a vanity metric?** Does it connect to real business value?
- [ ] **Are we measuring what's easy instead of what matters?**
- [ ] **Is this solving a real problem or just something we think is cool?**

**Red Team Notes:**
*[Be specific. "Your success metric of 'engagement' could mean anything. Define it."]*

### 2. Experimental Design Audit

- [ ] **Sample size sufficient?** Show the statistical power calculation
- [ ] **Control properly designed?** Is it a true control or contaminated?
- [ ] **Confounding variables identified?** What else could cause the effect?
- [ ] **Duration appropriate?** Long enough for novelty to wear off?

**Methodological Holes Found:**
*[Example: "You're only testing with power users who already love us. Selection bias."]*

### 3. Pre-Commitment Check

- [ ] **Are success criteria defined BEFORE seeing data?**
- [ ] **Are analysis segments pre-defined?** (No p-hacking allowed)
- [ ] **Is there a clear "ship/kill" decision framework?**
- [ ] **Will the team actually honor negative results?**

**Missing Commitments:**
*[Example: "No clear action if metric improves by 3% instead of target 5%"]*

### 4. Weaponization Detection

**Is this experiment being used to:**

- [ ] Avoid difficult but necessary work?
- [ ] Justify a predetermined conclusion?
- [ ] Delay a decision indefinitely?
- [ ] Make someone look good rather than learn?

**Red Flags Spotted:**
*[Example: "This feels like testing to confirm, not testing to learn"]*

### 5. Debt vs. Value Assessment

**Craftsmanship Debt Score:** [1-5]  
**Learning Value:** [Low/Medium/High]  
**Risk Level:** [Low/Medium/High]  

- [ ] Is the debt proportional to learning value?
- [ ] Can we actually pay down this debt if experiment succeeds?
- [ ] Are we calling corner-cutting "experimentation"?

### 6. Unintended Consequences Analysis

**What could go wrong that the team hasn't considered?**

- [ ] **User Trust Impact:** Could this damage how users perceive us?
- [ ] **Technical Cascade:** Could this break something seemingly unrelated?
- [ ] **Market Signal:** What message does this send to competitors?
- [ ] **Team Morale:** Could failure here demoralize the team?

**Biggest Unconsidered Risk:**
*[Example: "If this fails publicly, we lose credibility in our core differentiator"]*

### 7. Bias Analysis

**Which cognitive biases are at play here?**

- [ ] **Confirmation Bias:** Looking for data to support predetermined conclusion
- [ ] **Selection Bias:** Testing with unrepresentative sample
- [ ] **Survivorship Bias:** Only measuring users who didn't quit
- [ ] **Recency Bias:** Overweighting recent feedback
- [ ] **Anchoring Bias:** Success metric anchored to arbitrary number

**Most Dangerous Bias Present:**
*[Example: "The team is emotionally invested in this solution working"]*

---

## Red Team Verdict

### Overall Recommendation

⬜ **GREEN LIGHT** - Experiment is well-designed and will generate real learning  
⬜ **YELLOW LIGHT** - Proceed with specific modifications listed below  
⬜ **RED LIGHT** - Fundamental flaws that invalidate the experiment  

### Required Modifications (if Yellow)

1. [Specific change needed]
2. [Specific change needed]
3. [Specific change needed]

### If Red Light, Primary Reason

⬜ Hypothesis not falsifiable  
⬜ Vanity metrics / no real business value  
⬜ Experimental design fatally flawed  
⬜ Clear confirmation bias  
⬜ Weaponization of principles detected  

---

## Good Faith vs Bad Faith Red Teaming

| Behavior | Bad Faith (Toxic) | Good Faith (Helpful) |
|----------|-------------------|---------------------|
| Criticism | "This is stupid" | "The hypothesis lacks falsifiability" |
| Blocking | "I don't like this" | "The sample size is statistically insufficient" |
| Nitpicking | Finding any reason to say no | Focusing on material flaws |
| Alternative | "Do my idea instead" | "Consider testing X assumption first" |

---

## Post-Experiment: Red Team Retrospective

**Did the Red Team's concerns materialize?**

- [ ] Yes - we caught a real issue
- [ ] No - the concern was unfounded
- [ ] Partially - some issues, not others

**What did we learn about our blind spots?**
*[Example: "We consistently underestimate sample size needs"]*

**How can future Red Teams be more effective?**
*[Continuous improvement of the process itself]*

---

## Red Team Hall of Fame

*Celebrate the saves - times when Red Team prevented disasters:*

| Date | Experiment | Issue Caught | Impact |
|------|------------|--------------|---------|
| 2024-01 | Premium pricing | Selection bias in test group | Saved $50K dev cost |
| 2024-02 | Onboarding flow | Vanity metric (time vs. completion) | Prevented 15% churn |

---

## The Red Team Oath

*Read this before each review:*

> "I promise to be professionally ruthless and personally kind.  
> I will attack ideas, not people.  
> I will seek truth, not victory.  
> My dissent is an act of respect, not rebellion.  
> I am here to help us learn faster and fail cheaper.  
> This is my job, and I will do it without apology."

---

## Remember

> "The role of the Red Team is not to be right, but to make sure we're not wrong in stupid ways."

**Strong ideas, loosely held. That's how we win.**

---

*Template Version: 1.0 - Making dissent a feature, not a bug*  
*Based on Learning Machine Manifesto: Weaponization Prevention + Data Over Drama*
