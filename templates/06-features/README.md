# Feature Documentation Templates

This directory contains standardized documentation templates for feature development that align with The Learning Machine Manifesto and the Kiro Why/What/How framework.

## Template Structure

Each feature follows this hierarchical documentation structure:

```
feature-name/
├── requirements.md        # Shared parent spec (Why/What/How)
├── design.md             # Shared technical design with Red Team Review
├── experiment-summary.md # Post-experiment learnings and decisions
├── frontend/
│   ├── tasks.md         # Frontend implementation tasks (linked to hypothesis)
│   ├── design.md        # Frontend-specific design
│   └── test-plan.md     # Frontend testing strategy
├── backend/
│   ├── tasks.md         # Backend implementation tasks (linked to hypothesis)
│   ├── design.md        # Backend-specific design
│   └── test-plan.md     # Backend testing strategy
└── devops/
    ├── tasks.md         # Infrastructure tasks (experiment-focused)
    ├── design.md        # DevOps design and architecture
    └── test-plan.md     # Infrastructure testing strategy
```

## Core Principles

These templates embed The Learning Machine Manifesto principles:

### 🎯 Assume Nothing, Test Everything

- Every document starts with hypotheses, not facts
- Requirements include "Riskiest Assumption" sections
- Failure criteria defined upfront

### 🚀 Seek Velocity, Not Perfection  

- Templates optimized for speed of learning
- Craftsmanship Debt Scores track conscious trade-offs
- Build-Measure-Learn loops embedded throughout

### 💀 Celebrate Funerals for Bad Ideas

- Explicit failure criteria in requirements
- "When Pressure Hits" checklists for crisis protocols
- Learning logs capture insights from failures

### 📊 Data Over Drama

- Null hypothesis approach in test plans
- Red Team reviewers assigned for major features
- Metrics and success criteria defined before implementation

### 🎪 Guardrails, Not Handcuffs

- Templates provide structure without rigidity
- Copy-pasteable examples throughout
- Clear ownership with freedom to execute

### 🔄 The Loop is Our Lifeline

- Every document connects to the Build-Measure-Learn cycle
- Experiment design integrated into requirements
- Learning logs track hypothesis validation

### 🧠 Mindset is the OS

- "Our Philosophy" sections in each template
- Cultural principles reinforced throughout
- Crisis protocols embedded in every document

## Template Features

### Enhanced in v2.0 (Based on Red Team Feedback)

#### Experiment-Focused Tasks

- **Hypothesis Connection:** All `tasks.md` files now include the experiment context
- **Kiro-Style Structure:** Clean phases with clear requirement/design linking
- **Implementation Focus:** Connect the "Why" directly to implementation tasks

#### Anti-Documentation Theater

- **Fidelity Levels:** Design docs scaled to experiment maturity (Low/Medium/High-Fidelity)
- **Adaptive Detail:** Match documentation effort to feature validation stage
- **Experiment-First:** Focus on learning, not comprehensive documentation

#### Formalized Red Team Reviews

- **Structured Challenge Process:** Formal template for Red Team findings
- **Risk-Based Assessment:** High/Medium/Low risk categorization
- **Actionable Outcomes:** Required actions before proceeding

#### Celebration of Learning

- **Experiment Summary Template:** Dedicated document for post-experiment learnings
- **Failure Celebration:** Explicit quantification of time/money saved from invalidated hypotheses
- **Learning Capture:** Structured reflection on what was discovered

### Original Features

#### Hierarchical Linking

- Domain-specific files explicitly reference parent documents
- Clear separation of concerns between shared and specialized content
- Consistent cross-references between related documents

#### Cultural Safeguards

- **Craftsmanship Debt Scores** (1-5) for tracking technical debt
- **Red Team Reviewers** with formal review process
- **Failure Criteria** to define when to pivot or kill features
- **Crisis Protocols** to maintain principles under pressure

#### Lean Documentation

- Placeholder examples for quick adoption
- Minimal viable documentation approach
- Focus on actionable content over comprehensive coverage

## Usage Instructions

### 1. Copy the Template

```bash
cp -r templates/06-features/feature-template your-feature-name/
```

### 2. Customize the Templates

- Replace all `*[placeholders]*` with actual content
- Update links to match your feature name
- Fill in team members and dates

### 3. Follow the Workflow

1. Start with `requirements.md` - define your hypothesis and experiment design
2. Create shared `design.md` - architectural decisions with appropriate fidelity level
3. Conduct Red Team Review - challenge assumptions and identify blind spots
4. Break down into domain-specific tasks (now linked to hypothesis)
5. Execute experiment and gather data
6. Complete `experiment-summary.md` - celebrate learnings and make decisions
7. Iterate or pivot based on validated learnings

### 4. Maintain Living Documents

- Update as you learn and iterate
- Track decisions in learning logs
- Review and refactor templates based on usage

## Key Sections Guide

### Requirements.md (Shared Parent)

- **Why**: Problem statement and riskiest assumption
- **What**: Functional requirements and experiment design  
- **How**: Implementation strategy and timeline

### Design.md (Shared Parent)  

- **Why**: Design goals and architectural decisions
- **What**: Technical specifications and interfaces
- **How**: Implementation approach and rollout plan

### Domain-Specific Files

- **tasks.md**: Actionable work breakdown with clear ownership
- **design.md**: Domain-specific technical details extending parent design
- **test-plan.md**: Comprehensive testing strategy connecting to requirements

## Best Practices

### Writing Effective Requirements

- State assumptions explicitly as testable hypotheses
- Define both success metrics and failure criteria
- Include experiment design with measurable outcomes
- Set honest Craftsmanship Debt Scores

### Creating Robust Designs

- Document architectural trade-offs with rationale
- Assign Red Team reviewers for major decisions
- Include monitoring and observability from day one
- Plan for failure modes and recovery

### Planning Implementation

- Break work into deployable increments
- Define clear Definition of Done criteria
- Include security and compliance requirements
- Plan for rollback and disaster recovery

### Testing Strategy

- Test behavior, not implementation
- Include security and performance testing
- Plan for load testing and failure scenarios
- Define clear pass/fail criteria

## Integration with Tools

These templates integrate with common development tools:

- **Jira/Linear**: Tasks can be imported as tickets
- **GitHub Issues**: Use templates for issue creation
- **Confluence/Notion**: Import for team wikis
- **Monitoring**: Links to dashboards and alerts
- **CI/CD**: Test plans inform pipeline design

## Feedback and Iteration

The templates themselves follow the Learning Machine principles:

- **Everything is a Draft**: Templates evolve based on usage
- **Learning Logs**: Capture what works and what doesn't
- **Failure Analysis**: Improve based on project outcomes
- **Team Input**: Incorporate feedback from all stakeholders

## Support

For questions or suggestions about these templates:

1. Review the manifesto principles
2. Check existing usage examples
3. Propose improvements via pull request
4. Share learnings in team retrospectives

Remember: The goal is not to be right, it's to get better faster.
