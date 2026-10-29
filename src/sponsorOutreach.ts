// src/sponsorOutreach.ts — user-initiated sponsor contact (no backend)
export function sponsorDeepLink(phone: string, message: string): string {
  const encoded = encodeURIComponent(message)
  return `sms:${phone}?body=${encoded}`
}

export function outreachMessage(craving: string): string {
  return `Hey, I'm having a hard time right now${craving ? ` (${craving})` : ''}. Can you talk?`
}
