// src/Onboarding.tsx — first-run passphrase creation (no recovery; warn user)
import { useState } from 'react'
import { newSalt, deriveKey, toBase64 } from './crypto'
import { db, SETTINGS_SALT, SETTINGS_VERIFIER } from './db'

interface Props {
  onReady: (key: CryptoKey) => void
}

export function Onboarding({ onReady }: Props) {
  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (pass.length < 12) { setError('Passphrase must be at least 12 characters.'); return }
    if (pass !== confirm) { setError('Passphrases do not match.'); return }
    setBusy(true)
    try {
      const salt = await newSalt()
      const key = await deriveKey(pass, salt)
      // verifier: encrypt a known string so we can check the passphrase later
      const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: crypto.getRandomValues(new Uint8Array(12)) }, key, new TextEncoder().encode('sponsor-ok'))
      // store salt + verifier iv/ct (simplified: store salt only; verifier added in next iteration)
      await db.settings.put({ key: SETTINGS_SALT, value: toBase64(salt) })
      await db.settings.put({ key: SETTINGS_VERIFIER, value: toBase64(enc) })
      onReady(key)
    } catch {
      setError('Failed to initialize secure storage.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section style={{ padding: '1rem', maxWidth: 480, margin: '0 auto' }}>
      <h1>Welcome to Sponsor</h1>
      <p>Create a passphrase to encrypt your data on this device. <strong>If you forget it, your data cannot be recovered.</strong></p>
      <form onSubmit={submit}>
        <label>Passphrase (min 12 chars)<br />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="new-password" />
        </label>
        <br />
        <label>Confirm<br />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        </label>
        <br />
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <button type="submit" disabled={busy}>{busy ? 'Setting up…' : 'Create'}</button>
      </form>
    </section>
  )
}
