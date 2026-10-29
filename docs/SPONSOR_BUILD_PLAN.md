# Sponsor Build Plan

**Project:** Sponsor — SUD (Substance Use Disorder) recovery support PWA
**Repo:** outlandisdavis-cloud/sponsor-pwa
**Status:** Phase 0 — spec reconstruction (original `sponsor-build-plan.md` was never persisted)
**Source of truth for scope:** `/mnt/sdcard/Documents/buildplan.md` (session transcript summary)

## 1. Overview

A privacy-first, offline-capable Progressive Web App for people in recovery from substance use disorders. All AI inference runs on-device; no user data leaves the device except explicit, user-initiated sponsor outreach. The app provides craving-support conversation, validated mood/relapse-risk tracking, and automated escalation to crisis resources when indicated.

### Non-negotiables
- **Privacy by default:** on-device AI, encrypted local storage, no telemetry, no cloud sync without explicit opt-in.
- **Safety first:** SUD-specific guardrails (never advise cold-turkey alcohol/benzo withdrawal — lethal risk); crisis detection overrides everything.
- **Offline-first:** core features (breathing/grounding tools, mood logging, journaling) work with no network.
- **Clinical humility:** not a medical device; always routes to licensed care and crisis lines.

## 2. AI Engine (On-Device, Privacy-First)

### Primary model
- **Qwen2.5-1.5B-Instruct** — runs in-browser via WebGPU (~950 MB download, 25–45 tok/s on desktop).
- Loaded lazily; cached in IndexedDB after first download; progress UI shown.

### Fallback chain (ordered by capability → footprint)
1. Qwen2.5-1.5B-Instruct (primary)
2. Llama-3.2-1B
3. Qwen2.5-0.5B
4. SmolLM2-360M
5. Fully deterministic breathing/grounding tools (no AI required) — always available offline.

### RAG knowledge base
- 200 curated chunks across CBT, DBT, MI (Motivational Interviewing), SMART Recovery.
- In-browser vector search: **Orama** + **MiniLM-L6-v2** embeddings (also on-device).
- Retrieval injects top-k chunks into the system prompt; citations shown to user.

### Fine-tuning
- QLoRA on the base model using synthetic recovery dialogues.
- Export to browser-compatible format (ONNX / WebGPU-compatible weights).
- Fine-tuned weights shipped as an optional, separately downloadable pack.

### Conversation design
- Persona: warm, non-judgmental recovery companion; never prescribes medication or medical advice.
- Session memory: last N turns + summarized long-term context stored locally, encrypted.
- Hard limits enforced by safety layer (§3) before any model output reaches the UI.

## 3. Safety Architecture (3-Layer Defense)

Executed in order on every user message and every model output; any layer can short-circuit.

1. **Regex interceptor (< 1 ms)** — keyword/phrase patterns for imminent self-harm, overdose, withdrawal emergency, suicidal ideation. On hit: block LLM call, render crisis UI.
2. **Emotion classifier (< 15 ms)** — small on-device classifier (distil/mini) scoring distress/relapse-risk. Thresholds route to intervention tier.
3. **LLM safety guardrails** — system-prompt rules + output filter: no medical dosing, no cold-turkey advice for alcohol/benzodiazepines (lethal withdrawal risk), no enabling, no glamorization.

### Critical guardrails
- **Never advise cold-turkey alcohol or benzodiazepine withdrawal.** Always recommend medically supervised detox; provide SAMHSA/988.
- **PHQ-9 Item 9 (suicidal ideation) ≥ 1** → auto-trigger an **uncloseable crisis modal** with 988 Suicide & Crisis Lifeline and SAMHSA National Helpline (1-800-662-HELP) links + "Call now" buttons. Modal cannot be dismissed by user; requires explicit acknowledgment + follow-up check-in scheduling.

### Crisis resources (always available offline, pinned in UI)
- 988 Suicide & Crisis Lifeline (call/text 988)
- SAMHSA National Helpline: 1-800-662-HELP (4357), 24/7, free, confidential
- Crisis Text Line: text HOME to 741741
- Emergency services: 911

## 4. Mood Tracker & Relapse Alerts

### Validated questionnaires (administered on schedule + on-demand)
- PACS (Penn Alcohol Craving Scale)
- BSCQ (Brief Situational Confidence Questionnaire)
- PHQ-9 (depression; Item 9 = crisis trigger)
- GAD-7 (anxiety)
- AWARE (Advance WArning of RElapse)
- BAM (Brief Addiction Monitor)
- Daily HALT check (Hungry, Angry, Lonely, Tired) + sleep quality

### Behavioral pattern detection
- Isolation Spiral (reduced check-ins + low mood + withdrawal from contacts)
- Pink Cloud (elevated mood + overconfidence + skipped supports)
- Sleep Degradation (trend in sleep quality scores)
- Pre-Relapse Sequence (craving + trigger + isolation clustering)

### Automated escalation
- Score thresholds → targeted interventions (breathing exercise, journaling prompt, craving urge-surfing).
- Higher thresholds → sponsor outreach (user-initiated contact to designated sponsor, with user consent and preview).
- Crisis thresholds → §3 crisis modal.

## 5. Tech Stack

- **Framework:** React 19 + Vite + TypeScript
- **PWA:** `vite-plugin-pwa` (Workbox) — precache app shell, runtime cache for model weights, offline fallback.
- **Storage:** Dexie.js (IndexedDB) with AES-256-GCM encryption at rest (Web Crypto API).
- **AI runtime:** Transformers.js / ONNX Runtime Web (WebGPU backend) for model + embeddings.
- **Vector search:** Orama (in-browser).
- **Styling:** TBD in Phase 1 spike (Tailwind vs. CSS modules); accessibility (WCAG 2.1 AA) required.
- **Deployment:** Web PWA → Google Play (TWA) → Apple App Store (Capacitor). Web-first; stores are Phase 6.

## 6. Data Model (Dexie/IndexedDB, encrypted)

Tables (conceptual):
- `settings` — app config, consent flags, sponsor contact (encrypted).
- `moodEntries` — timestamp, questionnaire scores, HALT, notes (encrypted).
- `journalEntries` — free text (encrypted).
- `conversations` — session turns + summary (encrypted).
- `ragChunks` — knowledge base (not user data; cacheable).
- `modelCache` — downloaded weights (cache, evictable).
- `crisisEvents` — audit of crisis triggers (minimal, local only).

All user-data tables encrypted with a key derived from a user-set passphrase (PBKDF2 → AES-256-GCM). Key never leaves device; passphrase loss = data loss (warned at onboarding).

## 7. 28-Week Roadmap (6 Phases)

- **Phase 1 — Foundation (wks 1–4):** Scaffold repo, CI, PWA shell, encrypted storage, onboarding + passphrase, crisis resources screen, WebGPU/model-load spike + perf budget.
- **Phase 2 — Core AI (wks 5–10):** Inference pipeline, fallback chain, RAG + embeddings, conversation UI, safety layers 1–2, guardrail prompts.
- **Phase 3 — Tracking (wks 11–16):** Mood tracker, questionnaires, HALT, journaling, pattern detection v1, escalation logic.
- **Phase 4 — Polish & Safety Hardening (wks 17–21):** Layer-3 output filter, PHQ-9 crisis modal, sponsor outreach flow, accessibility audit, offline stress tests.
- **Phase 5 — Clinical Review & Beta (wks 22–26):** Clinical review of content/guardrails, beta with recovery-community volunteers, telemetry-free feedback, bug bash.
- **Phase 6 — Launch (wks 27–28):** Store submissions (TWA/Capacitor), privacy policy, final security review, launch.

## 8. Testing Strategy

- Unit: safety regex/interceptor, scoring, pattern detection, encryption round-trip.
- Integration: inference pipeline fallback chain, RAG retrieval, offline mode.
- E2E (Playwright): onboarding, crisis modal uncloseable behavior, mood flow, offline.
- Safety red-team: adversarial prompts attempting to elicit withdrawal advice, dosing, enabling; must all be blocked.
- Performance budget: model load < 30s on 4G; first token < 3s; offline core features < 1s.

## 9. Privacy & Security

- No analytics/telemetry by default; any opt-in must be explicit and revocable.
- No server-side storage of user content.
- CSP strict; no third-party scripts in app shell.
- Dependency audit in CI; lockfile committed.
- Threat model doc to be added in Phase 1.

## 10. Open Questions (resolve in Phase 1)

1. Mobile WebGPU availability/perf — may force smaller default model on mobile.
2. Whether fine-tuned weights ship in v1 or post-launch.
3. Sponsor (human) contact integration: SMS deep-link vs. in-app message (no backend) — likely deep-link.
4. Clinical reviewer recruitment and scope of review.

## 11. Phase 0 Deliverables (this step)

- [x] Repo created: https://github.com/outlandisdavis-cloud/sponsor-pwa
- [x] This spec committed.
- [ ] README updated with project summary.
- [ ] Issue tracker seeded with Phase 1 tasks.
- [ ] (Optional) Reconstruct a fuller `sponsor-build-plan.md` if the original transcript surfaces more detail.
