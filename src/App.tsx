// src/App.tsx — Sponsor shell: routing, crisis overlay, sponsor contact
import { useState } from 'react'
import { db } from './db'
import { Onboarding } from './Onboarding'
import { CrisisResources } from './CrisisResources'
import { Chat } from './Chat'
import { MoodTracker } from './MoodTracker'
import { Journal } from './Journal'
import { SponsorSettings } from './SponsorSettings'
import { CrisisModal } from './CrisisModal'

export type Tab = 'chat' | 'mood' | 'journal' | 'sponsor'

const TABS: { id: Tab; label: string }[] = [
  { id: 'chat', label: 'Chat' },
  { id: 'mood', label: 'Mood' },
  { id: 'journal', label: 'Journal' },
  { id: 'sponsor', label: 'Sponsor' },
]

export default function App() {
  const [key, setKey] = useState<CryptoKey | null>(null)
  const [ready, setReady] = useState(false)
  const [crisisOpen, setCrisisOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('chat')

  // Load the session once the encrypted store is initialized
  useState(() => {
    (async () => {
      await db.settings.get('kdf_salt')
      setReady(true)
    })()
  })

  if (!ready) return <div style={{ padding: '1rem' }}>Loading…</div>
  if (!key) return <Onboarding onReady={(k) => setKey(k)} />

  return (
    <div>
      <header style={header}>
        <h1>Sponsor</h1>
        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.85 }}>
          Privacy-first recovery support — everything stays on your device.
        </p>
      </header>

      <nav style={nav}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              ...baseNav,
              borderBottomColor: tab === t.id ? 'var(--accent)' : 'transparent',
              fontWeight: tab === t.id ? 700 : 500,
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main style={main}>
        {tab === 'chat' && <Chat />}
        {tab === 'mood' && <MoodTracker onCrisis={() => setCrisisOpen(true)} />}
        {tab === 'journal' && <Journal cryptoKey={key} />}
        {tab === 'sponsor' && <SponsorSettings cryptoKey={key} />}
      </main>

      {crisisOpen && <CrisisModal onAcknowledge={() => setCrisisOpen(false)} />}
      <CrisisResources />
    </div>
  )
}

const header = {
  padding: '1rem 1.25rem',
  borderBottom: '1px solid #e5e7eb',
  marginBottom: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
} as const

const nav = {
  display: 'flex',
  gap: '0.25rem',
  marginBottom: '1rem',
  flexWrap: 'wrap',
} as const

const baseNav = {
  padding: '0.5rem 0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.9rem',
} as const

const main = {
  maxWidth: 640,
  margin: '0 auto',
  padding: '0 1.25rem 2rem',
  minHeight: 'calc(100vh - 140px)',
} as const
