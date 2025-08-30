# Risk Register: Known Unknowns & Technical Debt

> **Making the invisible visible.**
>
> If we can name our risks, we can manage them. If we can't, they manage us.

## Our Philosophy

We don't pretend risks don't exist—we make them explicit and trackable. Every risk is an opportunity to build resilience or learn something valuable. Technical debt is not shame; it's a conscious trade-off with interest rates.

**Principle:** "A known risk is a manageable risk. An unknown risk is a ticking time bomb."

---

## 🚨 Active Risks (High Priority)

### Risk #1: [Risk Name]

**Category:** [Technical/Business/Security/Operational]  
**Probability:** [High/Medium/Low] (X%)  
**Impact:** [High/Medium/Low] ([Dollar amount/time lost if realized])

**Description:**
[What could go wrong and why]

**Triggers:**

- [What would cause this risk to become reality]
- [Early warning signs we should watch for]

**Proposed Mitigations:**

- [Specific experiment to reduce uncertainty: What will we test and how?]
- [Concrete action to reduce probability: What will we build/change?]
- [Measurable step to reduce impact: How will we limit damage?]

> **💡 Mitigation Rule:** A risk without a proposed mitigation is just fear. Every risk must include a small, concrete experiment to reduce uncertainty.

**Owner:** [Person/team responsible for monitoring]  
**Next Review:** [Date]  
**Status:** 🔴 Monitoring | 🟡 Mitigating | 🟢 Resolved

---

### Risk #2: [Risk Name]

*[Continue pattern for each high-priority risk]*

---

## 🟡 Moderate Risks (Watch List)

| Risk | Category | Probability | Impact | Owner | Last Updated |
|------|----------|-------------|---------|-------|--------------|
| [Risk name] | [Type] | [High/Med/Low] | [High/Med/Low] | [Person] | [Date] |
| [Risk name] | [Type] | [High/Med/Low] | [High/Med/Low] | [Person] | [Date] |

---

## 💰 Technical Debt Inventory

### Critical Debt (Slowing us down now)

#### Debt Item #1: [System/Component Name]

**Debt Score:** 🔴 High (5/5)  
**Interest Rate:** [How much this costs us daily/weekly]  
**Principal:** [Original shortcut taken and why]

**Symptoms:**

- [How this manifests in daily work]
- [Specific pain points developers experience]

**Paydown Plan:**

- **Estimated Effort:** [Time/resources needed to fix]
- **Paydown Strategy:** [How we'll tackle this]
- **Success Criteria:** [How we'll know it's resolved]

**Owner:** [Team/person responsible]  
**Target Resolution:** [Date/milestone]

---

#### Debt Item #2: [System/Component Name]

*[Continue pattern for each critical debt item]*

---

### Moderate Debt (Manageable but growing)

| Debt Item | Component | Interest Rate | Effort to Fix | Target Quarter |
|-----------|-----------|---------------|---------------|----------------|
| [Issue] | [System] | [Daily cost] | [Time estimate] | [Q1/Q2/Q3/Q4] |
| [Issue] | [System] | [Daily cost] | [Time estimate] | [Q1/Q2/Q3/Q4] |

---

## 🎯 Risk Categories & Patterns

### Technical Risks

**Common Patterns:**

- **Single Points of Failure:** [Systems with no redundancy]
- **Legacy Dependencies:** [Old libraries/systems we depend on]
- **Scalability Limits:** [Known performance/capacity constraints]
- **Security Vulnerabilities:** [Unpatched systems or design flaws]

### Business Risks  

**Common Patterns:**

- **Market Changes:** [External factors affecting our assumptions]
- **Competitive Threats:** [New competitors or changing landscape]
- **Regulatory Changes:** [Legal/compliance risks]
- **Key Person Dependencies:** [Bus factor risks]

### Operational Risks

**Common Patterns:**

- **Process Failures:** [Manual processes that can break]
- **Communication Breakdowns:** [Information silos or gaps]
- **Resource Constraints:** [Budget, time, or skill limitations]
- **External Dependencies:** [Third-party services we rely on]

---

## 📊 Risk Dashboard

### Risk Distribution

```
🔴 High Priority:     [X] risks
🟡 Medium Priority:   [Y] risks  
🟢 Low Priority:      [Z] risks
📈 New This Month:    [A] risks
📉 Resolved This Month: [B] risks
```

### Debt Metrics

- **Total Debt Score:** [Sum of all debt scores]
- **Monthly Interest:** [Estimated productivity cost]
- **Debt Trend:** ↗️ Growing | → Stable | ↘️ Decreasing
- **Paydown Velocity:** [Debt points resolved per quarter]

---

## 🔄 Risk Management Process (Event-Triggered)

### Review Risks When

#### 🚨 **Immediate Review Triggers**

- A production incident occurs (review related risks)
- Starting a new major experiment or feature
- A team member raises a new concern
- External dependency changes (vendor, API, regulation)

#### 📅 **Periodic Health Checks**

- **Sprint Planning:** Quick scan for risks affecting upcoming work (5 min)
- **Monthly Retrospective:** Deep dive on realized risks and near-misses (30 min)
- **Quarterly Planning:** Strategic risk assessment with leadership (2 hours)

### Quick Risk Assessment (5 minutes)

**When triggered, ask:**

- What changed that might affect our risk profile?
- Is this risk already captured? If not, add it
- Do existing mitigations still apply?
- Who needs to know about this?

> **🤖 Automation Note:** Production incidents automatically sync with this register via [`risk-incident-sync`](../support-tools/risk-incident-sync/)

---

## 🧠 Risk Learning

### Recently Realized Risks

*What we learned when risks became reality*

#### [Risk Name] - Realized on [Date]

**What Happened:** [Brief description of the incident]  
**Impact:** [Actual cost/damage caused]  
**Root Cause:** [Why our mitigation didn't work]  
**Lessons Learned:** [What we'll do differently]  
**Process Changes:** [How we updated our approach]

### False Alarms

*Risks we worried about that didn't materialize*

| Risk | Why We Worried | Why It Didn't Happen | Learning |
|------|----------------|--------------------|----------|
| [Risk] | [Original concern] | [Changed conditions] | [What to watch for] |

---

## 🎪 Risk Appetite & Tolerance

### Our Risk Philosophy

**We actively take risks in:**

- New technology experiments (with good rollback plans)
- Market positioning and strategy
- Feature experimentation and user testing

**We minimize risks in:**

- Core system reliability and uptime
- Customer data security and privacy  
- Financial compliance and legal requirements

### Risk Decision Framework

```
High Impact + High Probability = 🚨 MITIGATE NOW
High Impact + Low Probability = 🛡️ MONITOR & PLAN
Low Impact + High Probability = 🔧 FIX WHEN CONVENIENT  
Low Impact + Low Probability = 📝 DOCUMENT & IGNORE
```

---

## 🎯 Success Metrics for Risk Management

### Risk Reduction Success

- **Incidents Prevented:** [Number of risks mitigated before becoming issues]
- **Recovery Speed:** [Average time to resolve when risks become reality]
- **Cost Avoidance:** [Estimated value of prevented incidents]

### Debt Management Success  

- **Debt Paydown Rate:** [Debt points resolved per quarter]
- **Developer Productivity:** [Self-reported impact of debt reduction]
- **System Reliability:** [Uptime improvement from debt reduction]

### Process Success

- **Risk Prediction Accuracy:** [% of realized risks we had identified]
- **Team Engagement:** [Participation in risk identification and review]
- **Proactive vs Reactive:** [% of risks addressed before becoming incidents]

---

## 🔗 Risk Interconnections

### How Risks Compound

```
Technical Debt → Slower Deployments → Reduced Experimentation → Market Risk
     ↓              ↓                    ↓                      ↓
Security Risk → Operational Load → Developer Burnout → Quality Risk
```

### Risk Mitigation Spillovers

*When fixing one risk reduces others*

- Improving automated testing → Reduces deployment risk + quality risk
- Better monitoring → Reduces operational risk + customer impact risk
- Documentation → Reduces knowledge risk + onboarding risk

---

## 🚀 Risk as Innovation Opportunity

### Risks That Became Strengths

*How addressing risks made us better*

**Example:**

- **Risk:** Single database point of failure
- **Solution:** Implemented database replication
- **Bonus:** Learned database scaling, improved disaster recovery
- **Innovation:** New capacity for data-intensive features

### Current Risk-to-Innovation Opportunities

- **Risk:** [Current risk]
- **Innovation Potential:** [How solving this could create new capabilities]
- **Experiment:** [Small test to explore the solution space]

---

*"A risk shared is a risk halved. A risk ignored is a risk doubled."*

---

*Last Updated: [Date] | Next Review: [Date] | Evolution: Based on incident learnings and team feedback*
