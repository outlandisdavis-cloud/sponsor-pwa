// src/safety.ts — 3-layer defense (layer 1 regex, layer 2 emotion, layer 3 LLM guardrails)

export type SafetyTier = 'safe' | 'caution' | 'crisis'

export interface SafetyResult {
  tier: SafetyTier
  reason?: string
  crisis?: boolean // triggers uncloseable modal
}

// Layer 1: regex interceptor (< 1ms)
const CRISIS_PATTERNS: RegExp[] = [
  /\b(suicid|kill myself|end my life|want to die|self[- ]harm)\b/i,
  /\b(overdose|od on|take all (my )?pills)\b/i,
  /\b(withdraw(al)?.*(alcohol|benzo|benzodiazepine))\b/i,
]

const WITHDRAWAL_PATTERNS: RegExp[] = [
  /\b(cold turkey|stop drinking (suddenly|all at once)|quit (alcohol|benzos?) cold)\b/i,
]

export function regexInterceptor(text: string): SafetyResult {
  for (const p of CRISIS_PATTERNS) {
    if (p.test(text)) return { tier: 'crisis', reason: 'crisis-keyword', crisis: true }
  }
  for (const p of WITHDRAWAL_PATTERNS) {
    if (p.test(text)) return { tier: 'caution', reason: 'withdrawal-advice-request' }
  }
  return { tier: 'safe' }
}

// Layer 2: emotion classifier stub (< 15ms). Real impl uses a small on-device model.
export function emotionClassifier(_text: string): SafetyResult {
  // Placeholder: always safe until model wired. Returns caution if distress keywords present.
  if (/\b(hopeless|worthless|can't go on|relapse)\b/i.test(_text)) {
    return { tier: 'caution', reason: 'distress-keyword' }
  }
  return { tier: 'safe' }
}

// Layer 3: system-prompt guardrails for the LLM
export const SYSTEM_GUARDRAILS = `You are Sponsor, a warm, non-judgmental recovery companion for people in substance use disorder recovery.
Rules you MUST follow:
- Never provide medical advice, dosing, or treatment plans.
- Never advise cold-turkey withdrawal from alcohol or benzodiazepines; it can be lethal. Always recommend medically supervised detox and provide 988 / SAMHSA.
- Never enable substance use or glamorize it.
- If the user expresses suicidal ideation or imminent self-harm, stop and direct them to 988 and emergency services.
- Keep responses concise, compassionate, and recovery-focused.
- Cite recovery frameworks (CBT, DBT, MI, SMART Recovery) when relevant.
`

export function combineSafety(text: string): SafetyResult {
  const r1 = regexInterceptor(text)
  if (r1.tier === 'crisis') return r1
  const r2 = emotionClassifier(text)
  if (r2.tier === 'crisis') return r2
  if (r1.tier === 'caution' || r2.tier === 'caution') return { tier: 'caution', reason: r1.reason ?? r2.reason }
  return { tier: 'safe' }
}
