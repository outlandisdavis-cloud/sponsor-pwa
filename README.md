# Sponsor — SUD Recovery Support PWA

A privacy-first, offline-capable Progressive Web App for people in recovery from substance use disorders.

## What it does

- **Craving-support conversation** — warm, non-judgmental on-device companion chat with safety guardrails
- **Validated mood & relapse-risk tracking** — PHQ-9, GAD-7, PACS, HALT, plus behavioral pattern detection (isolation spiral, pink cloud, sleep degradation, pre-relapse sequence)
- **Encrypted journal** — passphrase-derived AES-256-GCM, stored locally only
- **Crisis resources** — 988 Suicide & Crisis Lifeline, SAMHSA, Crisis Text Line, always available offline
- **Uncloseable crisis modal** — auto-triggered by PHQ-9 Item 9 ≥ 1
- **Sponsor outreach** — user-initiated SMS deep-link to a designated sponsor
- **On-device AI** — Qwen2.5-1.5B primary with fallback chain (Llama-3.2-1B → Qwen2.5-0.5B → SmolLM2-360M → deterministic tools)

## Privacy by default

- All data (mood logs, journal, conversations) stored **only on your device**, encrypted with a passphrase you choose
- AI runs entirely on-device; no prompts leave your device
- No analytics or telemetry
- No cloud sync without explicit opt-in

## Tech stack

React 19 + Vite + TypeScript · vite-plugin-pwa (Workbox) · Dexie.js (IndexedDB) · Web Crypto API (PBKDF2 + AES-256-GCM)

## Scripts

```bash
npm install
npm run dev      # dev server
npm run build    # tsc -b && vite build
npm run lint     # oxlint
npm test         # vitest run
```

## Safety

SUD-specific guardrails: never advises cold-turkey alcohol/benzo withdrawal (lethal). Crisis detection (regex + emotion classifier + LLM guardrails) overrides everything.

## License

MIT
