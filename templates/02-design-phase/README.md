# Design Phase: From Hypothesis to Experiment

> **"We believe this solution will work, and here's how we'll prove it cheaply."**
>
> Design isn't about perfect solutions - it's about testable experiments that minimize risk.

## Our Philosophy

Design Phase embodies the **Learning Machine Manifesto**:

- **🎯 Assume Nothing, Test Everything** - Every design decision becomes an experiment
- **🚀 Seek Velocity, Not Perfection** - ASCII prototypes beat pixel-perfect mockups  
- **🛡️ Red Team Reviews** - Challenge our assumptions before customers do
- **📊 Data Over Drama** - Design based on evidence, not opinions

## The Design Toolkit

### 🔍 **Tech Spike Check**

*[00-tech-spike-check.md](00-tech-spike-check.md)*

**When to Use:** Before designing anything, validate technical feasibility

**The Problem It Solves:** Beautiful designs that are impossible to build

**3 AM Test Question:** *"Can we actually build this?"*

### 🧪 **Experiment Brief**

*[01-experiment-brief.md](01-experiment-brief.md)*

**When to Use:** Convert research insights into testable design experiments

**The Problem It Solves:** Designing solutions instead of testing assumptions

**3 AM Test Question:** *"What's the riskiest assumption in our design?"*

### 🗺️ **User Journey Map**

*[02-user-journey-map.md](02-user-journey-map.md)*

**When to Use:** Map the end-to-end experience you're designing for

**The Problem It Solves:** Optimizing features instead of optimizing flows

**3 AM Test Question:** *"What's the user trying to accomplish, really?"*

### 📝 **Prototype Spec**

*[03-prototype-spec.md](03-prototype-spec.md)*

**When to Use:** Define what you'll build to test your design hypothesis

**The Problem It Solves:** Building more than you need to learn

**3 AM Test Question:** *"What's the minimum we can build to test this?"*

### ⚙️ **Tech Feasibility Check**

*[04-tech-feasibility-check.md](04-tech-feasibility-check.md)*

**When to Use:** Before committing to a design approach

**The Problem It Solves:** Designs that ignore technical reality

**3 AM Test Question:** *"What technical risks could kill this?"*

### 📋 **Experiment Summary**

*[05-experiment-summary.md](05-experiment-summary.md)*

**When to Use:** After testing your design to capture what you learned

**The Problem It Solves:** Insights get lost instead of informing next iteration

**3 AM Test Question:** *"What did this experiment teach us about our users?"*

---

## Design Anti-Patterns We Avoid

### 🎨 **Perfect Pixel Syndrome**

- **The Trap:** Spending weeks on high-fidelity designs before user validation
- **The Reality:** Users care about whether it solves their problem, not whether it's pretty
- **Safeguard:** Start with ASCII art, upgrade fidelity only after validation

### 🏗️ **Feature Factory Thinking**

- **The Trap:** Designing features instead of designing outcomes
- **The Reality:** Users hire products to accomplish jobs, not to use features
- **Safeguard:** Every design starts with "What job is the user trying to do?"

### 🎯 **Solution Attachment Bias**

- **The Trap:** Falling in love with the first design solution
- **The Reality:** The first idea is rarely the best idea
- **Safeguard:** Mandatory Red Team Review challenges every design assumption

---

## The Design Flow

```
Research Insights → Design Hypothesis → Prototype → Test → Learn → Iterate
       ↑                                                        ↓
       ←─────────── New Design Questions ←─────────────────────
```

### Design Fidelity Ladder

Our approach scales design effort to learning needs:

1. **Napkin Sketches** (Day 1) - Explore the problem space
2. **ASCII Prototypes** (Day 2-3) - Test core user flows  
3. **Clickable Mockups** (Week 2) - Validate interaction patterns
4. **Code Prototypes** (Week 3-4) - Test technical feasibility
5. **High-Fidelity Designs** (Only after validation) - Polish for production

### Phase Gate Questions

Before moving to Development Phase, answer these:

1. **User Need Validation:** Have we confirmed users actually want this solution?
2. **Technical Feasibility:** Can we build this within our constraints?
3. **Design Risk Assessment:** What are the biggest unknowns in our design?
4. **Success Metrics:** How will we know if this design works?
5. **Failure Criteria:** At what point would we kill this approach?

---

## Design Workflow Guide

### Week 1: Hypothesis Formation

1. **Start with [Tech Spike Check](00-tech-spike-check.md)**
   - Validate technical feasibility early
   - Identify constraints that will shape design
   - Surface technical risks before investing in design

2. **Create [Experiment Brief](01-experiment-brief.md)**
   - Convert research insights into design hypotheses
   - Define what you're trying to learn vs. what you're trying to build
   - Set clear success/failure criteria

### Week 2: Flow Design

3. **Map [User Journey](02-user-journey-map.md)**
   - Focus on end-to-end user experience
   - Identify moments that matter most
   - Find opportunities to create value

4. **Define [Prototype Spec](03-prototype-spec.md)**
   - Specify minimum viable prototype to test core assumptions
   - Balance learning value with build cost
   - Plan for multiple iteration cycles

### Week 3: Risk Validation

5. **Conduct [Tech Feasibility Check](04-tech-feasibility-check.md)**
   - Deep dive on technical risks identified in spike
   - Validate architecture assumptions
   - Plan for technical unknowns

6. **Complete [Experiment Summary](05-experiment-summary.md)**
   - Document what you learned from design experiments
   - Identify validated vs. invalidated assumptions
   - Plan next design iteration or proceed to development

---

## Integration with Other Phases

### From Research Phase

- **Validated problems** become design challenges
- **User insights** inform design principles
- **Market constraints** guide design decisions
- **Technical learnings** shape feasibility assessment

### To Development Phase

- **Validated designs** become development requirements
- **Technical feasibility** informs development planning
- **User flows** guide implementation priorities
- **Success metrics** become measurement frameworks

### Cross-Cutting Connections

- **Red Team Review:** Challenge every major design decision
- **Craftsmanship Debt:** Track design debt from rapid prototyping
- **Failure Celebration:** Celebrate design assumptions that get invalidated

---

## Design Success Metrics

### Design Velocity Indicators

- **Concept-to-Prototype Time:** <3 days from idea to testable prototype
- **Iteration Speed:** <1 week between design test cycles
- **User Feedback Integration:** <2 days from feedback to next iteration
- **Technical Risk Discovery:** Technical blockers identified within first week

### Quality of Design Learning

- Specific behavioral insights from user testing (not generic feedback)
- Clear evidence supporting or refuting design hypotheses
- Technical constraints that shape design direction
- Measurable improvement in user task completion

---

## Design Team Roles

### For Product Designers

- Champion user needs while balancing technical constraints
- Create experiments, not just designs
- Focus on outcomes (user success) over outputs (design artifacts)
- Collaborate closely with engineering on feasibility

### For Product Managers

- Define success metrics and failure criteria for design experiments
- Prioritize design learning based on business risk
- Ensure designs solve validated problems, not assumed ones
- Connect design decisions to business outcomes

### For Engineers  

- Participate early in design feasibility assessment
- Surface technical constraints that impact user experience
- Prototype key technical risks during design phase
- Balance design ambition with technical reality

---

## Common Design Challenges

### Balancing Speed vs. Quality

- **Start low-fidelity:** ASCII art and paper prototypes first
- **Upgrade fidelity gradually:** Only after user validation
- **Define "good enough":** What quality is needed for each learning goal?

### Managing Technical Constraints

- **Involve engineers early:** Technical feasibility shapes design possibilities
- **Prototype risky technical assumptions:** Code experiments in design phase
- **Design within constraints:** Technical limitations become creative challenges

### Avoiding Feature Creep

- **Stay focused on core user job:** Every design element serves the primary use case
- **Test minimally viable solutions:** Add complexity only after validation
- **Kill features ruthlessly:** Remove anything that doesn't advance core user goals

---

## Evolution Notes

Design templates evolve based on:

- **Speed of learning** - Templates that slow down user feedback get simplified
- **Quality of insights** - Design methods that generate surface insights get replaced  
- **Technical alignment** - Better integration between design and engineering processes
- **User outcome improvement** - Focus on templates that improve actual user success

---

## The Design Manifesto

**We design experiments, not just experiences.**

- We test with users more than we perfect with pixels
- We prototype to learn, not just to communicate
- We embrace technical constraints as creative catalysts
- We measure user success, not design aesthetics

The best design is one that users don't notice - they just succeed at their job.

---

*Last Updated: [Date] | Next Review: After next major design pivot*
