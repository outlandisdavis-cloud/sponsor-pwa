import { useEffect, useState } from 'react'
import { db } from './db'
import { Onboarding } from './Onboarding'
import { CrisisResources } from './CrisisResources'
import { Chat } from './Chat'
import { MoodTracker } from './MoodTracker'
import { CrisisModal } from './CrisisModal'

export default function App() {
  const [key, setKey] = useState<CryptoKey | null>(null)
  const [ready, setReady] = useState(false)
  const [crisisOpen, setCrisisOpen] = useState(false)

  useEffect(() => {
    (async () => {
      await db.settings.get('kdf_salt')
      setReady(true)
    })()
  }, [])

  if (!ready) return <p>Loading…</p>
  if (!key) return <Onboarding onReady={setKey} />
  return (
    <main>
      <h1>Sponsor</h1>
      {crisisOpen && <CrisisModal onAcknowledge={() => setCrisisOpen(false)} />}
      <button onClick={() => setCrisisOpen(true)} style={{ marginBottom: '1rem' }}>Trigger crisis modal (demo)</button>
      <MoodTracker />
      <Chat />
      <CrisisResources />
    </main>
  )
}
