// src/patterns.ts — behavioral pattern detection over mood entries
export interface MoodPoint { ts: number; score: number; halt: number; sleep?: number }

export type Pattern = 'isolation-spiral' | 'pink-cloud' | 'sleep-degradation' | 'pre-relapse-sequence'

export function detectPatterns(points: MoodPoint[]): Pattern[] {
  const out: Pattern[] = []
  if (points.length < 3) return out
  const recent = points.slice(-7)
  // Isolation Spiral: declining scores + rising HALT
  const scoresDeclining = recent.every((p, i, a) => i === 0 || p.score <= a[i - 1].score)
  const haltRising = recent[recent.length - 1].halt > recent[0].halt + 1
  if (scoresDeclining && haltRising) out.push('isolation-spiral')
  // Pink Cloud: high scores but skipped supports (approximated by low HALT with high score)
  const last = recent[recent.length - 1]
  if (last.score >= 8 && last.halt === 0) out.push('pink-cloud')
  // Sleep Degradation
  const sleeps = recent.map((p) => p.sleep ?? 3).filter((n) => n !== undefined)
  if (sleeps.length >= 3 && sleeps[sleeps.length - 1] < sleeps[0] - 1) out.push('sleep-degradation')
  // Pre-Relapse Sequence: craving high + isolation + sleep drop
  if (last.score <= 3 && last.halt >= 3) out.push('pre-relapse-sequence')
  return out
}
