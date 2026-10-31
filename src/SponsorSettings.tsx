// src/SponsorSettings.tsx — designated sponsor contact (encrypted)
import { useState, useEffect } from 'react'
import { db } from './db'
import { saveEncrypted } from './store'
import { decrypt, fromBase64 } from './crypto'
import { sponsorDeepLink, outreachMessage } from './sponsorOutreach'

interface Props {
  cryptoKey: CryptoKey
}

export function SponsorSettings({ cryptoKey }: Props) {
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    (async () => {
      const contact = await db.sponsorContacts.get(1)
      if (contact) {
        try {
          const decrypted = await decrypt(cryptoKey, fromBase64(contact.iv), fromBase64(contact.ct).buffer as ArrayBuffer)
          const data = JSON.parse(decrypted) as { phone?: string; consent?: boolean }
          setPhone(data.phone ?? '')
          setConsent(!!data.consent)
        } catch {
          /* ignore */
        }
      }
    })()
  }, [cryptoKey])

  async function save() {
    if (!phone.trim()) return
    await saveEncrypted(cryptoKey, 'sponsorContacts', {
      phone: phone.trim(),
      consent: consent,
      updatedAt: Date.now(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const isContacted = phone.trim().length > 0

  return (
    <section style={{ maxWidth: 640, margin: '0 auto', padding: '1rem' }}>
      <h2>Sponsor contact</h2>
      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        Your designated sponsor is contacted only when you choose, via SMS, and is never intercepted by Sponsor.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Sponsor phone number (e.g. +1 555 123 4567)"
          style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 6 }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            style={{ width: '1rem' }}
          />
          I consent to Sponsor contacting this sponsor on my behalf for high-risk situations.
        </label>
        <button onClick={save} disabled={!phone.trim()}>
          {saved ? 'Saved' : 'Save sponsor contact'}
        </button>
        {isContacted && (
          <a
            href={sponsorDeepLink(phone, outreachMessage('craving'))}
            style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: '#1f2937',
              color: '#fff',
              borderRadius: 6,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Contact sponsor (SMS)
          </a>
        )}
      </div>
    </section>
  )
}
