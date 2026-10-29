export function CrisisResources() {
  const resources = [
    { name: '988 Suicide & Crisis Lifeline', detail: 'Call or text 988 (24/7)', href: 'tel:988' },
    { name: 'SAMHSA National Helpline', detail: '1-800-662-HELP (4357), 24/7, free & confidential', href: 'tel:18006624357' },
    { name: 'Crisis Text Line', detail: 'Text HOME to 741741', href: 'sms:741741?body=HOME' },
    { name: 'Emergency Services', detail: '911', href: 'tel:911' },
  ]
  return (
    <section style={{ padding: '1rem', maxWidth: 640, margin: '0 auto' }}>
      <h2>Crisis Resources</h2>
      <p>If you are in immediate danger, call 911. These lines are free and confidential.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {resources.map((r) => (
          <li key={r.name} style={{ marginBottom: '0.75rem' }}>
            <a href={r.href} style={{ fontWeight: 600 }}>{r.name}</a>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{r.detail}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
