// src/outputFilter.ts — layer 3 output filter for LLM responses
const BLOCKED_PATTERNS: RegExp[] = [
  /\bcold turkey\b/i,
  /\bstop (drinking|using) (suddenly|all at once)\b/i,
  /\bdose (of|amount)\b/i,
  /\bhow (much|many) (to take|pills)\b/i,
  /\b(you should|try) (drink|use|take)\b/i,
]

export function filterOutput(text: string): { ok: boolean; text: string; reason?: string } {
  for (const p of BLOCKED_PATTERNS) {
    if (p.test(text)) {
      return { ok: false, text: 'I can\'t provide that. If you need medical guidance, please contact a clinician or 988.', reason: 'blocked-pattern' }
    }
  }
  return { ok: true, text }
}
