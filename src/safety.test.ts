import { describe, it, expect } from 'vitest'
import { regexInterceptor, combineSafety } from './safety'
import { detectPatterns } from './patterns'
import { QUESTIONNAIRES, phq9Item9 } from './questionnaires'
import { deriveKey, encrypt, decrypt, newSalt } from './crypto'

describe('safety', () => {
  it('flags suicidal text as crisis', () => {
    expect(regexInterceptor('I want to kill myself').tier).toBe('crisis')
  })
  it('flags withdrawal advice request as caution', () => {
    expect(regexInterceptor('should I quit alcohol cold turkey').tier).toBe('caution')
  })
  it('safe for benign text', () => {
    expect(combineSafety('I feel okay today').tier).toBe('safe')
  })
})

describe('patterns', () => {
  it('detects isolation spiral', () => {
    const pts = [
      { ts: 1, score: 7, halt: 0 },
      { ts: 2, score: 5, halt: 2 },
      { ts: 3, score: 3, halt: 3 },
    ]
    expect(detectPatterns(pts)).toContain('isolation-spiral')
  })
})

describe('questionnaires', () => {
  it('PHQ-9 scores sum', () => {
    const q = QUESTIONNAIRES.PHQ9
    expect(q.score([1,1,1,1,1,1,1,1,1])).toBe(9)
  })
  it('PHQ-9 item9 crisis flag', () => {
    const a = [0,0,0,0,0,0,0,0,1]
    expect(phq9Item9(a)).toBe(true)
  })
})

describe('crypto', () => {
  it('round-trips plaintext', async () => {
    const salt = await newSalt()
    const key = await deriveKey('a-very-long-passphrase', salt)
    const { iv, ct } = await encrypt(key, 'hello world')
    const out = await decrypt(key, iv, ct)
    expect(out).toBe('hello world')
  })
})
