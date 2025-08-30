# Deep Systems Analysis: Design Phase Templates

## 1. Strategic Assessment

### Fundamental Job-to-be-Done

**The core JTBD for this template system is:** *To create the minimal shared understanding necessary to run a falsifiable experiment that generates institutional learning.*

**Current System Performance:** 7/10
The templates achieve lean documentation but miss critical psychological and organizational dynamics.

### Single Biggest Failure Mode

**The Confirmation Bias Cascade**: The templates assume rational actors but don't defend against the most common failure pattern—teams unconsciously designing experiments to confirm what they already believe. The system lacks "circuit breakers" to stop motivated reasoning from corrupting the entire process.

### Systemic Risks

1. **The Sunk Cost Amplifier**: Once teams fill out all 5 templates, psychological ownership makes it nearly impossible to kill bad ideas
2. **The Handoff Illusion**: Templates create false confidence that communication has occurred when critical context remains unshared
3. **The Metric Theater**: Teams optimize for filling templates rather than learning velocity
4. **The Zombie Experiment**: Experiments that should pivot continue because templates don't force hard stops

### Hidden Opportunities

1. **Pre-mortem Thinking**: Templates could force teams to predict failure modes upfront
2. **Learning Velocity Metrics**: Templates could track time-to-learning, not just outcomes
3. **Assumption Genealogy**: Templates could link assumptions to their evidence sources

---

## 2. Deep-Dive Analysis

### Multi-Persona Stress Test Results

#### Persona A: The Passionate Designer

**Current Template Vulnerability:**

- Can hide extensive design work inside "prototype spec"
- No mechanism to prevent over-polishing
- ASCII art constraint is easily bypassed with "See Figma link"

**Behavioral Prediction:** Will create beautiful, high-fidelity designs offline, then retrofit them into the template structure. The experiment becomes about validating their design rather than testing an assumption.

#### Persona B: The Pragmatic Engineer

**Current Template Vulnerability:**

- Tech feasibility comes too late (document #4)
- No early technical spike requirement
- Missing edge case documentation

**Behavioral Prediction:** Will discover blocking technical constraints after design is "approved," creating rework and frustration. Will build defensive abstractions "just in case" the experiment succeeds.

#### Persona C: The Biased Founder/PM

**Current Template Vulnerability:**

- Can frame hypothesis to guarantee success
- No requirement for "kill criteria"
- Success metrics can be gamed post-hoc

**Behavioral Prediction:** Will write hypothesis as "Users want X" rather than "Users will do Y." Will interpret any positive signal as validation. Will pivot the success metric after seeing initial data.

### Cognitive Bias Analysis

#### Biases AMPLIFIED by Current Templates

1. **Confirmation Bias**: No requirement to define what would DISPROVE the hypothesis
2. **Planning Fallacy**: No historical velocity data to ground estimates
3. **Anchoring Bias**: First solution proposed becomes the only solution explored
4. **Availability Heuristic**: Recent customer feedback weighted too heavily
5. **Narrative Fallacy**: Post-hoc stories explain away failed experiments

#### Biases MITIGATED by Current Templates

1. **Scope Creep**: "Explicitly NOT Building" section works well
2. **Feature-itis**: Focus on single assumption is effective
3. **Analysis Paralysis**: Time-boxed feasibility check prevents overthinking

### Second-Order Effects

#### On Code Quality

- **Current Reality**: "Temporary" experiment code becomes permanent because it "works"
- **Missing Safeguard**: No explicit "expiration date" for experiment code
- **Result**: Technical debt disguised as "MVP features"

#### On Team Dynamics

- **Current Reality**: Templates become weapons in political battles ("But the template says...")
- **Missing Element**: No retrospective process to improve the templates themselves
- **Result**: Process calcification and learned helplessness

#### On Learning Culture

- **Current Reality**: Failed experiments feel like failed projects
- **Missing Frame**: No celebration of "successful failures" that invalidate bad ideas quickly
- **Result**: Risk aversion and hypothesis padding

---

## 3. Strategically Revised Template

### Enhanced: 01-experiment-brief.md (v3)
