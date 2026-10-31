// src/store.ts — encrypted persistence helpers (AES-256-GCM via Web Crypto)
import { db } from './db'
import { encrypt, toBase64 } from './crypto'

// A typed view of the DB so we can index by table name without TS index-signature
// errors (SponsorDB declares tables explicitly and has no index signature).
function tableRef<T extends 'journalEntries' | 'sponsorContacts'>(_table: T) {
  return db as unknown as {
    journalEntries: { put: (r: { iv: string; ct: string; createdAt: number }) => Promise<number> }
    sponsorContacts: { put: (r: { iv: string; ct: string; createdAt: number }) => Promise<number> }
  }[T]
}

export async function saveEncrypted(
  key: CryptoKey,
  table: 'journalEntries' | 'sponsorContacts',
  record: Record<string, unknown> & { createdAt?: number }
) {
  const { iv, ct } = await encrypt(key, JSON.stringify(record))
  const now = typeof record.createdAt === 'number' ? record.createdAt : Date.now()
  await tableRef(table).put({
    iv: toBase64(iv),
    ct: toBase64(ct),
    createdAt: now,
  })
}
