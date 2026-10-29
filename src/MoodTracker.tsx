// src/MoodTracker.tsx — daily mood + HALT logging
import { useState } from 'react'
import { QUESTIONNAIRES } from './questionnaires'
import { detectPatterns } from './patterns'

export function MoodTracker() {
  const [halt, setHalt] = useState([0, 0, 0, 0])
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)

  function toggle(i: number) {
    const next = [...halt]
    next[i] = next[i] ? 0 : 1
    setHalt(next)
  }

  function save() {
    const point = { ts: Date.now(), score: 5, halt: halt.reduce((a, b) => a + b, 0) }
    const patterns = detectPatterns([point])
    setSaved(true)
    // eslint-disable-next-line no-console
    console.log('mood saved', point, patterns, note)
  }

  const labels = ['Hungry', 'Angry', 'Lonely', 'Tired']
  return (
    <section style={{ padding: '1rem', maxWidth: 640, margin: '0 auto' }}>
      <h2>Mood Tracker</h2>
      <p>Daily HALT check:</p>
      {labels.map((l, i) => (
        <label key={l} style={{ marginRight: '1rem' }}>
          <input type="checkbox" checked={!!halt[i]} onChange={() => toggle(i)} /> {l}
        </label>
      ))}
      <br />
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notes (optional)" style={{ width: '100%', marginTop: '0.5rem' }} />
      <br />
      <button onClick={save}>Save check-in</button>
      {saved && <p>Saved.</p>}
      <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Instruments available: {Object.keys(QUESTIONNAIRES).join(', ')}</p>
    </section>
  )
}
