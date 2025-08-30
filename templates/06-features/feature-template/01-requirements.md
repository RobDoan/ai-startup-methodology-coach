# Feature Requirements: *[Feature Name]*

**Feature ID:** *FEAT-XXXX*  
**Date:** *YYYY-MM-DD*  
**Status:** 🧪 Hypothesis | 🔬 Experimenting | ✅ Validated | 💀 Invalidated  
**Craftsmanship Debt Score:** *[1-5]* *(1=production-ready, 5=pure experiment)*  
**Red Team Reviewer:** *@username*  

---

## Why

*The purpose and strategic rationale for this feature*

### Core Problem
>
> **What customer pain are we solving?**  
*Describe the specific problem in 1-2 sentences. Include user quotes or data if available.*

### Riskiest Assumption
>
> **What is the single riskiest assumption we are testing with this feature?**  
*State it as: "We believe that [specific users] will [specific behavior] because [specific reason]"*

### Success Metrics
>
> **How will we know if we're right or wrong?**  

- **Primary Metric:** *[e.g., 20% increase in user retention after 7 days]*
- **Leading Indicators:** *[e.g., 50% of users engage within first session]*
- **Guardrail Metrics:** *[e.g., No more than 5% increase in error rates]*

### Failure Criteria
>
> **What result would make us kill this feature?**  
*Pre-commit to specific thresholds that would trigger a rollback or pivot*

- *[e.g., Less than 10% adoption after 2 weeks]*
- *[e.g., Customer support tickets increase by >15%]*
- *[e.g., Performance degrades by >100ms at p95]*

---

## What

*The concrete deliverables and scope*

### User Story
>
> **As a** *[user type]*  
> **I want to** *[action/goal]*  
> **So that** *[benefit/value]*

### Functional Requirements

*What the feature MUST do (numbered list for traceability)*

1. **[REQ-001]** *The system shall [specific behavior]*
2. **[REQ-002]** *Users must be able to [specific action]*
3. **[REQ-003]** *The feature shall integrate with [existing system]*

### Non-Functional Requirements

*Quality attributes and constraints*

- **Performance:** *[e.g., <200ms response time at p95]*
- **Scale:** *[e.g., Support 10,000 concurrent users]*
- **Security:** *[e.g., All data encrypted at rest and in transit]*
- **Accessibility:** *[e.g., WCAG 2.1 AA compliant]*

### Out of Scope

*What we are explicitly NOT doing (to prevent scope creep)*

- *[Feature or capability we're not building]*
- *[Integration we're not supporting]*
- *[Use case we're not addressing]*

### Experiment Design
>
> **How are we testing our hypothesis?**

**Type:** A/B Test | Fake Door | Concierge MVP | Wizard of Oz | Other  
**Duration:** *[e.g., 2 weeks]*  
**Sample Size:** *[e.g., 5% of traffic, minimum 1000 users]*  
**Control Group:** *[Description of baseline experience]*  
**Treatment Group:** *[Description of new experience]*  

---

## How

*The implementation approach and timeline*

### Implementation Strategy
>
> **How will we build this incrementally?**

**Phase 1: MVP** *(Week 1-2)*

- *[Minimal viable feature set]*
- *[What we're testing]*
- *[Expected learning]*

**Phase 2: Iteration** *(Week 3-4)*

- *[Based on Phase 1 learnings]*
- *[Additional capabilities]*
- *[Refined hypothesis]*

**Phase 3: Scale** *(If validated)*

- *[Production hardening]*
- *[Full rollout plan]*
- *[Monitoring and observability]*

### Technical Approach

*High-level technical decisions*

- **Architecture Pattern:** *[e.g., Event-driven, REST API, GraphQL]*
- **Data Storage:** *[e.g., PostgreSQL for transactions, Redis for cache]*
- **Key Dependencies:** *[External services or internal systems]*
- **Major Trade-offs:** *[What we're optimizing for vs. what we're sacrificing]*

### Team & Timeline

- **Squad Lead:** *@username*
- **Frontend:** *@username*
- **Backend:** *@username*
- **DevOps:** *@username*
- **Data Analyst:** *@username*

**Key Milestones:**

- [ ] *[Date]* - Experiment design approved
- [ ] *[Date]* - MVP deployed to staging
- [ ] *[Date]* - Experiment launched (5% traffic)
- [ ] *[Date]* - Go/No-Go decision
- [ ] *[Date]* - Full rollout (if validated)

---

## Our Philosophy
>
> *"We are not a company. We are a learning machine."*

This feature follows our core principles:

- **🧪 Hypothesis-Driven:** Every feature starts as a testable assumption
- **🎯 Truth-Seeking:** We try to prove ourselves wrong, not right
- **🚀 Velocity Over Perfection:** Ship experiments, not features
- **💀 Celebrate Failures:** An invalidated hypothesis that saves 6 months is a victory

---

## When Pressure Hits Checklist

*Use this when deadlines loom or stakeholders push for certainty*

- [ ] Have we stated our riskiest assumption clearly?
- [ ] Have we defined failure criteria upfront?
- [ ] Is our Craftsmanship Debt Score honest?
- [ ] Have we assigned a Red Team reviewer?
- [ ] Are we measuring learning velocity, not just feature delivery?

**Remember:** These principles are our shield during tough times, not a luxury for good times.

---

## Learning Log

*Updated after each iteration*

### Iteration 1: *[Date]*

- **Hypothesis:** *[What we believed]*
- **Result:** *[What actually happened]*
- **Learning:** *[What we learned]*
- **Next Action:** *[Pivot, persevere, or kill]*

---

**Next Review:** *[Date]* | **Next Hypothesis:** *[Link to next experiment]*
