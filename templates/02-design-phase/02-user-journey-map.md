# User Journey Map: [Name of Experiment]

**Purpose:** To visualize the critical path a user must take to (in)validate our hypothesis and to define how we will measure it.

---

## 1. The Critical Path

**This is the shortest sequence of actions that generates the success signal.**

**Entry Point:** [Where/how the user enters the journey. e.g., "Sees a banner on the dashboard."]

1. **Action:** [User clicks the banner.]
   * **System Response:** [Redirects to the feature page.]
2. **Action:** [User reads the value proposition.]
   * **System Response:** [Page displays features and a single 'Learn More' CTA.]
3. **Action:** [User clicks 'Learn More'.]
   * **System Response:** [Shows a 'Coming Soon' modal with an email field.]
4. **Action:** [User enters their email and clicks 'Submit'.]
   * **System Response:** [Shows a 'Thank You' confirmation.]

**Success Signal:** The user completes Step 4.

---

## 2. Measurement Plan

**How will we track progress through this journey?**

| Step # | Action | Analytics Event Name |
| :--- | :--- | :--- |
| 1 | Clicks banner | `experiment_hook_clicked` |
| 3 | Clicks 'Learn More' | `experiment_pitch_accepted` |
| 4 | Submits email | `experiment_conversion_completed` |

---

## 3. Key Screens & Components

**What UI is absolutely necessary for this journey?**

* **Screen 1: The Hook** (e.g., Dashboard Banner)
* **Screen 2: The Pitch** (e.g., Feature Landing Page)
* **Screen 3: The Ask** (e.g., 'Coming Soon' Modal)
* **Screen 4: The Confirmation** (e.g., 'Thank You' Message)

---

## 4. Potential Drop-off Points & Risks

**Where could this go wrong?**

| Step # | Risk Description | What We'll Learn If Users Drop Off Here |
| :--- | :--- | :--- |
| 1 | User doesn't click the banner. | The hook is ineffective or poorly placed. |
| 3 | User doesn't click 'Learn More'. | The value proposition is weak or unclear. |
| 4 | User doesn't submit their email. | The commitment is too high for the perceived value. |

---

**Connected Documents:**

* `01-experiment-brief.md`
* `03-prototype-spec.md`
