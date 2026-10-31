// src/db.ts — Dexie (IndexedDB) schema; user-data tables store encrypted blobs
import Dexie, { type Table } from 'dexie'

export interface EncryptedRecord {
  id?: number
  iv: string // base64
  ct: string // base64
  createdAt: number
}

export interface MoodEntry extends EncryptedRecord {}
export interface JournalEntry extends EncryptedRecord {}
export interface ConversationEntry extends EncryptedRecord {}
export interface SettingsRecord {
  key: string
  value: string // base64-encoded encrypted blob OR plaintext flag
}

/** Sponsor contact record, encrypted at rest. */
export interface SponsorRecord {
  phone: string
  consent: boolean
  updatedAt: number
}

export class SponsorDB extends Dexie {
  moodEntries!: Table<MoodEntry, number>
  journalEntries!: Table<JournalEntry, number>
  conversations!: Table<ConversationEntry, number>
  sponsorContacts!: Table<EncryptedRecord, number>
  settings!: Table<SettingsRecord, string>

  constructor() {
    super('sponsor')
    this.version(1).stores({
      moodEntries: '++id, createdAt',
      journalEntries: '++id, createdAt',
      conversations: '++id, createdAt',
      sponsorContacts: '++id, updatedAt',
      settings: 'key',
    })
  }
}

export const db = new SponsorDB()

export const SETTINGS_SALT = 'kdf_salt'
export const SETTINGS_VERIFIER = 'passphrase_verifier'
export const SETTING_SPONSOR_CONTACT = 'sponsor_contact'
export const SETTING_SPONSOR_CONSENT = 'sponsor_consent'
