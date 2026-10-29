// src/Chat.tsx — conversation UI
import { useState } from 'react'
import { respond } from './ai'
import type { ChatMessage } from './ai'

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setBusy(true)
    try {
      const { text: reply } = await respond(next, text)
      setMessages([...next, { role: 'assistant', content: reply }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <section style={{ padding: '1rem', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ minHeight: 200, border: '1px solid #ccc', padding: '0.5rem', marginBottom: '0.5rem' }}>
        {messages.map((m, i) => (
          <p key={i}><strong>{m.role}:</strong> {m.content}</p>
        ))}
        {busy && <p><em>Thinking…</em></p>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send() }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="How are you feeling?" style={{ width: '80%' }} />
        <button type="submit" disabled={busy}>Send</button>
      </form>
    </section>
  )
}
