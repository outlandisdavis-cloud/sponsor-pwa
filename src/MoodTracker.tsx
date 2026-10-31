// src/MoodTracker.tsx — mood + validated questionnaires + HALT + crisis trigger
import { useState } from 'react'
import {
  QUESTIONNAIRES,
  phq9Item9,
  type QuestionnaireId,
} from './questionnaires'
import { detectPatterns } from './patterns'

interface Props {
  onCrisis?: () => void
}

export function MoodTracker({ onCrisis }: Props) {
  const [active, setActive] = useState<QuestionnaireId>('HALT')
  const [answers, setAnswers] = useState<number[]>([])
  const [halt, setHalt] = useState([0, 0, 0, 0])
  const [score, setScore] = useState<number | null>(null)
  const [patterns, setPatterns] = useState<string[]>([])

  const q = QUESTIONNAIRES[active]

  function setAnswer(i: number, v: number) {
    const next = [...answers]
    next[i] = v
    setAnswers(next)
  }

  function toggleHalt(i: number) {
    const next = [...halt]
    next[i] = next[i] ? 0 : 1
    setHalt(next)
  }

  function submit() {
    const total = q.score(answers)
    setScore(total)
    if (active === 'PHQ9' && phq9Item9(answers)) {
      onCrisis?.()
    }
    const pts = [{ ts: Date.now(), score: total, halt: halt.reduce((a, b) => a + b, 0) }]
    setPatterns(detectPatterns(pts))
  }

  function reset() {
    setAnswers([])
    setScore(null)
    setPatterns([])
  }

  return (
    <section style={{ padding: '1rem', maxWidth: 640, margin: '0 auto' }}>
      <h2>Mood Tracker</h2>
      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {(Object.keys(QUESTIONNAIRES) as QuestionnaireId[]).map((id) => (
          <button
            key={id}
            onClick={() => {
              setActive(id)
              reset()
            }}
            style={{
              padding: '0.4rem 0.6rem',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              background: active === id ? '#1f2937' : '#fff',
              color: active === id ? '#fff' : '#000',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {id}
          </button>
        ))}
      </div>

      <h3>{q.name}</h3>
      {q.questions.map((question, i) => (
        <div key={question.id} style={{ marginBottom: '0.75rem' }}>
          <p style={{ margin: '0.25rem 0' }}>{question.text}</p>
          {question.options.map((opt) => (
            <label key={opt.label} style={{ marginRight: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name={question.id}
                checked={answers[i] === opt.value}
                onChange={() => setAnswer(i, opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      ))}

      <div style={{ marginTop: '1rem' }}>
        <p>Daily HALT check:</p>
        {['Hungry', 'Angry', 'Lonely', 'Tired'].map((l, i) => (
          <label key={l} style={{ marginRight: '1rem' }}>
            <input type="checkbox" checked={!!halt[i]} onChange={() => toggleHalt(i)} /> {l}
          </label>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={submit} disabled={answers.length === 0}>
          Submit
        </button>
      </div>

      {score !== null && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f3f4f6', borderRadius: 6 }}>
          <p style={{ margin: 0 }}>Score: {score}</p>
          {patterns.length > 0 && (
            <p style={{ margin: '0.25rem 0 0', color: '#b45309' }}>
              Patterns detected: {patterns.join(', ')}
            </p>
          )}
          {active === 'PHQ9' && phq9Item9(answers) && (
            <p style={{ margin: '0.25rem 0 0', color: 'crimson' }}>
              PHQ-9 Item 9 positive — please reach out. Crisis modal triggered.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
