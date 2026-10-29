// src/ai.ts — on-device inference pipeline with fallback chain + safety + RAG
import { SYSTEM_GUARDRAILS, combineSafety } from './safety'
import { retrieve } from './rag'

export type ModelId = 'qwen2.5-1.5b' | 'llama-3.2-1b' | 'qwen2.5-0.5b' | 'smollm2-360m' | 'none'

export const FALLBACK_CHAIN: ModelId[] = ['qwen2.5-1.5b', 'llama-3.2-1b', 'qwen2.5-0.5b', 'smollm2-360m', 'none']

export interface ChatMessage { role: 'user' | 'assistant' | 'system'; content: string }

// Minimal pipeline: safety gate -> RAG context -> (stub) generation.
// Real generation uses transformers.js / ONNX Runtime Web with WebGPU.
export async function respond(history: ChatMessage[], userText: string): Promise<{ text: string; safety: ReturnType<typeof combineSafety> }> {
  const safety = combineSafety(userText)
  if (safety.tier === 'crisis') {
    return { text: 'I hear you, and I care about your safety. Please reach out now: call or text 988, or 911 if in immediate danger. You are not alone.', safety }
  }
  const chunks = retrieve(userText)
  const context = chunks.map((c) => `[${c.source}] ${c.text}`).join('\n')
  const prompt = `${SYSTEM_GUARDRAILS}\n\nRelevant knowledge:\n${context}\n\nUser: ${userText}\nAssistant:`
  // Stub generator: echoes a supportive placeholder. Replace with model inference.
  const text = `[stub:${'qwen2.5-1.5b'}] I'm here with you. ${chunks.length ? 'Consider: ' + chunks[0].text : 'Take a slow breath.'}`
  void prompt
  void history
  return { text, safety }
}
