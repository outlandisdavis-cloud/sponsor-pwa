// src/Journal.tsx — private, encrypted journaling
import { useState, useEffect } from 'react'
import { db } from './db'
import { saveEncrypted } from './store'
import { decrypt, fromBase64 } from './crypto'

interface Props {
  cryptoKey: CryptoKey
}

export function Journal({ cryptoKey }: Props) {
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const entries = await db.journalEntries.toArray()
        const latest = entries[entries.length - 1]
        if (latest) {
          const decrypted = await decrypt(cryptoKey, fromBase64(latest.iv), fromBase64(latest.ct).buffer as ArrayBuffer)
          setNote(decrypted)
        }
      } catch {
        /* ignore corruption */
      }
    })()
  }, [cryptoKey])

  async function save() {
    if (!note.trim()) return
    await saveEncrypted(cryptoKey, 'journalEntries', { text: note.trim(), createdAt: Date.now() })
    setNote('')
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <section style={{ maxWidth: 640, margin: '0 auto', padding: '1rem' }}>
      <h2>Journal</h2>
      {saved && <p style={{ color: 'green' }}>Entry saved.</p>}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write privately. Your entry is encrypted and stays on this device."
        style={{ width: '100%', minHeight: 160, marginBottom: '0.75rem' }}
      />
      <button onClick={save} disabled={!note.trim()}>Save entry</button>
      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.75rem' }}>
        Encrypted at rest with your passphrase key. Nothing is stored on any server.
      </p>
    </section>
  )
}
