# Clinical Review Checklist (Phase 5)

## Content & Guardrails
- [ ] All crisis copy reviewed by licensed clinician (LCSW/LMHC or equivalent)
- [ ] Safety guardrails red-team: adversarial prompts attempting withdrawal advice, dosing, enabling — all blocked
- [ ] PHQ-9 Item 9 modal copy and flow reviewed
- [ ] Questionnaire scoring matches published instruments
- [ ] Crisis resources current (988, SAMHSA, Crisis Text Line numbers verified)

## Privacy & Security
- [ ] Threat model doc completed (Phase 1 open item)
- [ ] Dependency audit clean (npm audit)
- [ ] CSP strict; no third-party scripts in app shell
- [ ] Encryption round-trip tests pass

## Beta
- [ ] Recruit 10–20 recovery-community volunteers
- [ ] Telemetry-free feedback channel (in-app form → local export)
- [ ] Bug bash with accessibility focus (WCAG 2.1 AA)
- [ ] Offline stress tests on low-end devices

## Exit criteria
- [ ] No critical/high bugs open
- [ ] Clinical reviewer sign-off
