// src/rag.ts — RAG knowledge base (200 curated chunks target; ships a seed set here)
export interface RagChunk {
  id: string
  source: string // CBT | DBT | MI | SMART
  text: string
}

export const SEED_CHUNKS: RagChunk[] = [
  { id: 'cbt-1', source: 'CBT', text: 'Urge surfing: cravings rise like a wave and naturally subside. Delay use by 15 minutes and observe the sensation without acting.' },
  { id: 'dbt-1', source: 'DBT', text: 'TIPP skills: Temperature (cold water), Intense exercise, Paced breathing, Paired muscle relaxation to reduce acute distress.' },
  { id: 'mi-1', source: 'MI', text: 'Motivational interviewing: evoke the person\'s own reasons for change; roll with resistance rather than confronting.' },
  { id: 'smart-1', source: 'SMART', text: 'SMART Recovery: build a balanced life, cope with urges, manage thoughts/feelings/behaviors, live a healthy lifestyle.' },
  { id: 'halt-1', source: 'CBT', text: 'HALT check: Hungry, Angry, Lonely, Tired. Addressing these basic needs reduces relapse risk.' },
]

// Minimal in-memory retrieval: keyword overlap scoring. Real impl uses Orama + MiniLM embeddings.
export function retrieve(query: string, k = 3): RagChunk[] {
  const q = query.toLowerCase().split(/\s+/)
  return SEED_CHUNKS
    .map((c) => ({ c, score: q.filter((w) => c.text.toLowerCase().includes(w)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.c)
}
