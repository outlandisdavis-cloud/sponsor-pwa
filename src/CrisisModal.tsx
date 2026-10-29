// src/CrisisModal.tsx — uncloseable crisis modal (PHQ-9 Item 9 / crisis trigger)
import { useEffect } from 'react'

interface Props { onAcknowledge: () => void }

export function CrisisModal({ onAcknowledge }: Props) {
  useEffect(() => {
    // prevent background scroll
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="crisis-title"
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', color: '#000', padding: '2rem', maxWidth: 480, borderRadius: 8 }}>
        <h2 id="crisis-title">You matter. Please reach out now.</h2>
        <p>If you're thinking about hurting yourself, you don't have to go through this alone.</p>
        <ul>
          <li><a href="tel:988">Call or text 988 — Suicide & Crisis Lifeline</a></li>
          <li><a href="tel:18006624357">SAMHSA: 1-800-662-HELP (4357)</a></li>
          <li><a href="sms:741741?body=HOME">Text HOME to 741741 — Crisis Text Line</a></li>
          <li><a href="tel:911">Emergency: 911</a></li>
        </ul>
        <p style={{ fontSize: '0.9rem' }}>Please contact someone you trust and a clinician. This app is not a substitute for care.</p>
        <button onClick={onAcknowledge}>I have reached out / I am safe for now</button>
      </div>
    </div>
  )
}
