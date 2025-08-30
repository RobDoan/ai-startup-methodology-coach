# Development Phase: Building to Learn

> **"We're building an experiment, not a product."**
>
> Development is about validating assumptions through working software, not creating comprehensive solutions.

## Our Philosophy

Development Phase embodies the **Learning Machine Manifesto**:

- **🚀 Seek Velocity, Not Perfection** - Ship experiments to learn faster than competitors
- **📊 Craftsmanship Debt Tracking** - Make the cost of speed visible and conscious
- **💀 Celebrate Funerals** - Fast rollbacks are successful experiments
- **🛡️ Red Team Reviews** - Challenge technical approaches before implementation

## The Development Toolkit

### 📋 **Build Plan**

*[00-build-plan.md](00-build-plan.md)*

**When to Use:** Before writing any code for a new experiment

**The Problem It Solves:** Building more than needed to test core assumptions

**3 AM Test Question:** *"What's the minimum code needed to validate our hypothesis?"*

### ✅ **Pre-Flight Checklist**

*[pre-flight-checklist.md](pre-flight-checklist.md)*

**When to Use:** Before deploying any experiment to users

**The Problem It Solves:** Broken experiments that generate bad data instead of good learning

**3 AM Test Question:** *"Is this experiment ready to produce reliable data?"*

### 📋 **Experiment Debrief**

*[experiment-debrief.md](experiment-debrief.md)*

**When to Use:** After every development iteration to capture technical learning

**The Problem It Solves:** Technical insights get lost instead of informing architecture

**3 AM Test Question:** *"What did building this teach us about our system?"*

---

## Development Anti-Patterns We Avoid

### 🏗️ **Gold Plating Experiments**

- **The Trap:** Building production-ready code for early experiments
- **The Reality:** Most experiments will be killed or completely rewritten
- **Safeguard:** Explicit Craftsmanship Debt Scores (1-5) for every build decision

### 🎯 **Perfect Architecture Paralysis**

- **The Trap:** Designing perfect systems before understanding requirements
- **The Reality:** Requirements change based on user feedback from experiments
- **Safeguard:** Start with hardcoded values, abstract only after validation

### 🚀 **Premature Optimization**

- **The Trap:** Optimizing for scale before proving product-market fit
- **The Reality:** Dead products don't have scaling problems
- **Safeguard:** "Can it handle 10x current load?" test before any optimization

---

## The Development Flow

```
Validated Design → Build Plan → Code → Pre-Flight → Ship → Learn → Iterate
        ↑                                                      ↓
        ←─────────── Architecture Insights ←─────────────────
```

### Craftsmanship Debt Ladder

Our approach balances speed with maintainability:

1. **Debt Score 1 (Hardcoded MVP)** - Fixed values, no abstraction
2. **Debt Score 2 (Basic Logic)** - Simple conditionals, minimal structure
3. **Debt Score 3 (Structured Code)** - Proper separation, basic patterns
4. **Debt Score 4 (Production-Ready)** - Full testing, monitoring, documentation
5. **Debt Score 5 (Enterprise-Grade)** - Optimized, scalable, maintainable

### Phase Gate Questions

Before moving to Testing Phase, answer these:

1. **Experiment Completeness:** Can this code validate our core hypothesis?
2. **Measurement Capability:** Can we collect the data we need to decide?
3. **Rollback Preparedness:** Can we safely undo this if it fails?
4. **Technical Risk Assessment:** What could break and how would we fix it?
5. **Debt Consciousness:** What shortcuts did we take and why?

---

## Development Workflow Guide

### Week 1: Planning & Architecture

1. **Create [Build Plan](build-plan.md)**
   - Define minimum viable implementation for hypothesis testing
   - Set explicit Craftsmanship Debt Score based on experiment maturity
   - Plan for measurement and rollback from day one

2. **Technical Risk Assessment**
   - Identify components that could fail or perform poorly
   - Plan spike solutions for high-risk elements
   - Design monitoring for critical experiment metrics

### Week 2-3: Implementation

3. **Code with Measurement**
   - Build instrumentation as you build features
   - Focus on core user flow that validates hypothesis
   - Document any technical discoveries or surprises

4. **Prepare [Pre-Flight Checklist](pre-flight-checklist.md)**
   - Verify experiment can collect reliable data
   - Test rollback procedures work as expected
   - Validate monitoring and alerting are functional

### Week 4: Launch & Learn

5. **Ship & Monitor**
   - Deploy experiment with appropriate user exposure
   - Monitor both business and technical metrics closely
   - Be ready to rollback quickly if needed

6. **Complete [Experiment Debrief](experiment-debrief.md)**
   - Document technical learnings and architectural insights
   - Assess actual vs. predicted technical performance
   - Plan next iteration based on both user and technical feedback

---

## Integration with Other Phases

### From Design Phase

- **Validated prototypes** become implementation specifications
- **Technical feasibility assessments** guide architecture decisions
- **User flow definitions** inform development priorities
- **Success metrics** become measurement requirements

### To Testing Phase

- **Working experiments** ready for user validation
- **Measurement infrastructure** collecting reliable data
- **Technical monitoring** tracking system health
- **Rollback procedures** ready for quick failures

### Cross-Cutting Connections

- **Craftsmanship Debt Tracker:** Core tool for balancing speed vs. quality
- **Red Team Review:** Challenge technical approaches and architecture decisions
- **Crisis Framework:** Maintain development quality under shipping pressure

---

## Development Success Metrics

### Development Velocity Indicators

- **Code-to-Ship Time:** <1 week from code complete to user-facing experiment
- **Rollback Speed:** <1 hour from problem detection to rollback completion
- **Measurement Latency:** Data available within 24 hours of user interaction
- **Iteration Frequency:** New experiment versions every 1-2 weeks

### Quality of Technical Learning

- Clear insights about system performance under real user load
- Understanding of which technical approaches work vs. don't work
- Evidence-based decisions about where to invest in technical quality
- Technical constraints that inform product direction

---

## Development Team Roles

### For Engineers

- **Think like experimenters:** Build to learn, not just to work
- **Track debt consciously:** Use Craftsmanship Debt Scores honestly
- **Plan for rollbacks:** Make failure recovery fast and safe
- **Share technical insights:** Document what code taught you about users/system

### For Product Managers

- **Define minimum viable experiments:** Help engineers build less, learn more
- **Protect learning focus:** Resist feature creep that dilutes experiment validity
- **Support debt decisions:** Understand when speed is worth technical shortcuts
- **Connect technical to business:** Help engineers see how their work drives learning

### For DevOps/Infrastructure

- **Enable fast iteration:** Make deployment and rollback routine operations
- **Ensure measurement capability:** Infrastructure that captures experiment data reliably
- **Monitor experiment health:** Distinguish between expected and concerning system behavior
- **Plan for traffic spikes:** Experiments can change usage patterns unexpectedly

---

## Common Development Challenges

### Balancing Experiment Code vs. Production Code

- **Start with Debt Score 1-2:** Hardcode first, abstract after validation
- **Plan debt paydown:** If experiment succeeds, immediately plan quality improvements
- **Separate experiment from core:** Keep experimental code isolated from stable systems

### Managing Technical Risk in Experiments

- **Circuit breakers everywhere:** Experiments shouldn't break core functionality
- **Feature flags are essential:** Ability to turn off experiments instantly
- **Monitoring is non-negotiable:** You can't learn from experiments you can't measure

### Maintaining Development Speed Under Uncertainty

- **Embrace throwaway code:** Most experiment code will never make it to production
- **Optimize for learning speed:** Time to user feedback beats time to perfect code
- **Document insights, not code:** The learning is more valuable than the implementation

---

## Technical Debt Management

### Debt Score Guidelines

**Score 1 (Hardcoded Experiment):**

- Acceptable for: First version of any new feature
- Must upgrade if: Experiment shows user traction
- Timeline: Can stay at this level for 1-2 months max

**Score 2-3 (Structured but Expedient):**

- Acceptable for: Validated experiments scaling to more users  
- Must upgrade if: Becomes core user workflow
- Timeline: Good for 3-6 months of experimentation

**Score 4-5 (Production Quality):**

- Required for: Core user workflows, proven features
- Investment justified by: User adoption and business impact
- Maintenance: Ongoing quality investment needed

---

## Evolution Notes

Development templates evolve based on:

- **Deployment frequency** - Processes that slow down shipping get streamlined
- **Quality incidents** - Balance between speed and stability based on real failures
- **Learning quality** - Templates that generate better technical insights get prioritized
- **Team productivity** - Approaches that help teams build and learn faster

---

## The Development Manifesto

**We code to learn, not just to work.**

- We ship experiments more than we perfect features
- We measure user behavior more than system performance  
- We embrace technical debt as conscious trade-offs for learning speed
- We rollback fearlessly when experiments teach us we're wrong

The best code is code that quickly teaches us what users actually want.

---

*Last Updated: [Date] | Next Review: After next major technical learning*
