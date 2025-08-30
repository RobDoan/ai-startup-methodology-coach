# Experiment Brief: [Title]

> **Template for hypothesis-driven development. Copy this file for each new experiment.**

## Our Philosophy

We don't build features; we test assumptions. Every line of code is a hypothesis waiting to be validated or invalidated. An invalidated hypothesis that saves six months of engineering is a massive victory.

---

## 🎯 The Hypothesis

### We Believe

*[State your core assumption as a testable hypothesis]*

**Example:** "We believe that adding social login will increase user signup conversion by 15% because users find email registration too friction-heavy."

### Success Metrics

*[Define BEFORE building - these are your North Star]*

- **Primary:** [The main metric that proves/disproves your hypothesis]
- **Secondary:** [Supporting metrics that provide context]
- **Guardrail:** [Metrics that must not degrade]

### The Null Hypothesis

*[What would disprove your assumption?]*
"There is no significant difference in [metric] between [control] and [treatment]."

---

## ☠️ Kill Criteria (Pre-Committed)

### We will kill this experiment if

- [ ] [Specific condition 1 with threshold]
- [ ] [Specific condition 2 with threshold]  
- [ ] [Timeline condition - when do we stop?]

### Rollback Triggers

- [ ] [Technical condition that requires immediate rollback]
- [ ] [Business condition that requires immediate rollback]

---

## 🏗️ The Experiment

### Minimum Viable Test (MVT)

*[Smallest possible test to validate/invalidate the hypothesis]*

### Build Plan

- **Timeline:** [Start date] → [Decision date]
- **Debt Score:** [1-5, where 5 = production ready, 1 = throwaway prototype]
- **Responsible:** [Who owns this experiment end-to-end]
- **Process:** Refer to the [Development Workflow](../practices/development-workflow.md) for our standard build process

### Implementation Strategy

- [ ] [Specific task 1]
- [ ] [Specific task 2]
- [ ] [Measurement setup]

---

## 📊 Measurement Plan

### Pre-Analysis Segments

*[Define these BEFORE seeing data to prevent p-hacking]*

- **Segment 1:** [e.g., New users vs Returning users]  
- **Segment 2:** [e.g., Mobile vs Desktop]
- **Segment 3:** [e.g., Geographic regions]

### Data Collection

- **Start Date:** [When measurement begins]
- **Sample Size:** [How many users/events needed for significance]
- **Analysis Date:** [When we make the decision]

---

## 🚨 Risks & Mitigations

### Known Risks

- **Risk 1:** [What could go wrong] → **Mitigation:** [How we'll handle it]
- **Risk 2:** [What could go wrong] → **Mitigation:** [How we'll handle it]

### Unknown Unknowns

*[What questions do we not know to ask yet?]*

---

## 🔗 Links & Context

- **Related ADR:** [Link to architectural decision if applicable]
- **Previous Experiments:** [Link to related past experiments]
- **Inspiration:** [External research, competitor analysis, user feedback]

---

## 📝 Experiment Log

### [Date] - Experiment Start

- [Brief update on progress, blockers, learnings]

### [Date] - Midpoint Check

- [Key observations, any hypothesis refinements]

### [Date] - Results & Decision

- **Objective Findings:** [What the data says]
- **Interpretation:** [What we think it means]  
- **Decision:** [Keep/Kill/Iterate/Scale]
- **Confidence Level:** [High/Medium/Low]

---

## 🎓 Next Hypothesis

*[What did this experiment teach us? What new questions emerged?]*

**If successful:** [What would we test next to scale this?]

**If failed:** [What alternative approach should we test?]

**New assumptions uncovered:** [What new hypotheses should we add to the backlog?]

---

## 🎉 Funeral Notice (If Killed)

**Date of Death:** [When we killed the hypothesis]

**Cause of Death:** [What data/insight killed it]

**Value of Death:** [Time/money/effort saved]

**Memorial:** [What we learned that we'll remember]

> **🤖 Automation Note:** This funeral will be automatically processed by [`funeral-automation`](../support-tools/funeral-automation/) and added to the Learning Library

---

*Template Version: 1.0 | Last Updated: [Date] | Evolution: [How this template should improve]*
