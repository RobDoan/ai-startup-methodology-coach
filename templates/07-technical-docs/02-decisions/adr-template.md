# ADR-XXX: [Decision Title]

> **Template for Architecture Decision Records**
>
> Copy this template for each significant architectural decision.

## Our Philosophy

We capture the "why" behind decisions, not just the "what." Every technical choice is a hypothesis about what will work best. When context changes, we revisit decisions with new ADRs rather than editing old ones.

**Principle:** "Future us will thank current us for explaining our reasoning."

---

## 🏢 ADR Office Hours

**Feeling intimidated by this template?** Don't let perfect be the enemy of good!

- **Weekly ADR Office Hours:** Every [Day] at [Time] - bring rough ideas for quick feedback
- **5-minute rule:** Get team blessing before investing in full write-up
- **Small decisions:** Use only Context, Decision, and Rationale sections
- **Remember:** ADRs are thinking tools, not bureaucratic hoops

---

## Decision Metadata

- **Decision Scale:** [S/M/L] *(S = minor/reversible, M = moderate impact, L = major/hard to reverse)*
- **Status:** 🟡 Proposed | 🟢 Accepted | 🔴 Deprecated | ⚪ Superseded by [ADR-XXX]
- **Date:** YYYY-MM-DD  
- **Decision Makers:** [Who had final say]
- **Consulted:** [Subject matter experts who provided input]
- **Informed:** [Teams/people who need to know about this decision]
- **Review Date:** [When we should revisit this decision]

> **For Small (S) decisions:** Only fill out Context, Decision Outcome, and Rationale sections. Skip detailed analysis unless needed.

---

## 🎯 Context and Problem Statement

### The Situation

*[What's happening that requires a decision?]*

### The Problem  

*[What specific challenge are we solving?]*

### Decision Drivers

*[What factors influence this decision?]*

- **Performance Requirements:** [If applicable]
- **Cost Constraints:** [Budget/resource limitations]
- **Time Constraints:** [Deadlines driving urgency]
- **Risk Tolerance:** [How much risk can we accept]
- **Team Skills:** [Current expertise and learning capacity]
- **Strategic Direction:** [How this aligns with company goals]

### Success Criteria

*[How will we know if this decision was right?]*

- **Technical:** [Performance, scalability, maintainability goals]
- **Business:** [Cost, time-to-market, competitive advantage]
- **Team:** [Developer experience, learning, productivity]

---

## 🔍 Options Considered

### Option 1: [Name]

**Description:** [Brief description of this approach]

**Pros:**

- ✅ [Advantage 1]
- ✅ [Advantage 2]
- ✅ [Advantage 3]

**Cons:**

- ❌ [Disadvantage 1]
- ❌ [Disadvantage 2]
- ❌ [Disadvantage 3]

**Estimated Effort:** [Time/complexity estimate]
**Risk Level:** [High/Medium/Low]

### Option 2: [Name]

**Description:** [Brief description of this approach]

**Pros:**

- ✅ [Advantage 1]
- ✅ [Advantage 2]

**Cons:**

- ❌ [Disadvantage 1]
- ❌ [Disadvantage 2]

**Estimated Effort:** [Time/complexity estimate]
**Risk Level:** [High/Medium/Low]

### Option 3: [Name]

*[Continue pattern for additional options]*

---

## ✅ Decision Outcome

### Chosen Option: "[Option Name]"

**Rationale:**
*[Clear explanation of why this option was selected. Link back to decision drivers and success criteria.]*

**The deciding factors were:**

1. [Primary reason - usually tied to most important decision driver]
2. [Secondary reason]
3. [Tertiary reason]

**Key Trade-offs Accepted:**
*[What we're giving up by choosing this option]*

- We accept [trade-off 1] in exchange for [benefit 1]
- We accept [trade-off 2] in exchange for [benefit 2]

---

## 🎉 Positive Consequences

*[Expected benefits of this decision]*

- [Benefit 1: e.g., Improved performance]
- [Benefit 2: e.g., Reduced operational complexity]  
- [Benefit 3: e.g., Better team productivity]

---

## ⚠️ Negative Consequences & Mitigations

*[Known downsides and how we'll address them]*

**Risk 1:** [Potential problem]

- **Mitigation:** [How we'll prevent/handle this]
- **Owner:** [Who's responsible for monitoring this]

**Risk 2:** [Potential problem]  

- **Mitigation:** [How we'll prevent/handle this]
- **Owner:** [Who's responsible for monitoring this]

---

## 📊 Validation Plan

### How We'll Know If This Decision Was Right

*[Specific metrics and timelines for measuring success]*

**Success Metrics:**

- [Metric 1] should [improve/decrease/maintain] by [amount] within [timeframe]
- [Metric 2] should [improve/decrease/maintain] by [amount] within [timeframe]

**Failure Signals:**

- If [condition 1], we should reconsider this decision
- If [condition 2], we should reconsider this decision

**Review Schedule:**

- **30-day check:** [Date] - Initial implementation review
- **90-day check:** [Date] - Full impact assessment  
- **Annual review:** [Date] - Strategic alignment review

> **🤖 Automation Note:** Review reminders will be sent automatically by [`adr-review-reminder`](../support-tools/adr-review-reminder/)

---

## 🔄 Implementation Plan

### Immediate Actions

- [ ] [Task 1 - who owns it - by when]
- [ ] [Task 2 - who owns it - by when]
- [ ] [Task 3 - who owns it - by when]

### Migration Strategy

*[If this changes existing systems]*

- **Phase 1:** [Description and timeline]
- **Phase 2:** [Description and timeline]  
- **Phase 3:** [Description and timeline]

### Communication Plan

- [ ] Engineering team briefing - [Date]
- [ ] Documentation updates - [Date]
- [ ] Stakeholder notification - [Date]

---

## 🔗 Related Information

### Links

- **Supporting Research:** [Links to analysis, benchmarks, etc.]
- **Related ADRs:** [Links to other relevant decisions]
- **Implementation Details:** [Links to technical specs, code repos]
- **Previous Discussion:** [Links to Slack threads, meeting notes, etc.]

### Assumptions Made

*[What we assumed to be true when making this decision]*

- **Assumption 1:** [What we assumed] - *[Why this matters]*
- **Assumption 2:** [What we assumed] - *[Why this matters]*

### External Dependencies

*[What outside factors could affect this decision]*

- **Dependency 1:** [What we depend on] - *[Risk if it changes]*
- **Dependency 2:** [What we depend on] - *[Risk if it changes]*

---

## 🎓 Learning Opportunities

### What This Decision Teaches Us

*[Broader insights for future decisions]*

- **Pattern:** [What pattern does this reveal about our decision-making]
- **Principle:** [What principle should guide similar future decisions]
- **Anti-Pattern:** [What should we avoid doing in similar situations]

### Knowledge Gaps Exposed  

*[What we wish we knew better when making this decision]*

- **Gap 1:** [Area where more knowledge would have helped]
- **Gap 2:** [Area where more knowledge would have helped]

### Next Hypothesis

*[What questions does this decision create?]*
**We now believe** [new hypothesis stemming from this decision], **and we can test this by** [how we might validate the new assumption].

---

## 📝 Decision Log

### [Date] - Decision Proposed

*[Brief note on initial proposal and reasoning]*

### [Date] - Consultation Period  

*[Summary of feedback received, concerns raised]*

### [Date] - Decision Finalized

*[Final discussion points that led to decision]*

### [Date] - Implementation Started

*[Note on beginning of implementation]*

### [Date] - First Review

*[Results of initial validation]*

---

*"We make decisions with the information we have, not the information we wish we had."*

---

*ADR Template Version: 1.0 | Last Updated: [Date] | Next Evolution: Based on team feedback*
