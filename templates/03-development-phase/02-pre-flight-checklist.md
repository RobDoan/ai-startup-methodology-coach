> **Our Engineering Philosophy:** This is a final safety check, not a substitute for automated testing. It covers the manual steps that a CI/CD pipeline cannot. The Release Owner is empowered to hit "NO-GO" if they are not confident. We value safety and quality at the point of release.

# Pre-Flight: [Feature/Experiment Name]

**Release Owner:** [Engineer Name] | **Release Date:** [YYYY-MM-DD]

- [ ] **Feature Flag Confirmed:** `[flag_name]` is OFF in production.
- [ ] **Analytics Confirmed:** Key metric `[metric_name]` is firing in staging.
- [ ] **Monitoring Confirmed:** Dashboards/alerts for affected services are ready. [Link]
- [ ] **Rollback Plan:** The plan is to disable the feature flag. No other steps are needed.
- [ ] **Team Notified:** Support & Product are aware the experiment is launching.

**[GO] / [NO-GO]** - Decision by [Release Owner]
