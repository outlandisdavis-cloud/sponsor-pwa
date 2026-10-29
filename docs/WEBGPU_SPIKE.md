# WebGPU Model-Load Spike (Phase 1)

**Goal:** Validate that Qwen2.5-1.5B-Instruct (and the fallback chain) can load and run in-browser via WebGPU with acceptable perf, especially on mobile/TWA, before committing to it as the primary model.

## Test matrix
- Desktop Chrome (WebGPU enabled) — baseline
- Desktop Firefox (WebGPU) — secondary
- Android Chrome via TWA — primary mobile target
- iOS Safari (WebGPU) — secondary (Capacitor path)

## Measurements
- Model download size & time on 4G / Wi-Fi
- Time to first token (TTFT) after load
- Sustained tokens/sec (target ≥ 8 tok/s mobile, ≥ 25 tok/s desktop)
- Peak memory / VRAM (must not crash tab on 4 GB devices)
- Fallback trigger: if WebGPU unavailable, chain to Llama-3.2-1B → Qwen2.5-0.5B → SmolLM2-360M → deterministic tools

## Pass/fail gates
- Pass: TTFT < 3s desktop / < 8s mobile; ≥ target tok/s; no tab crash on mid-tier device.
- Fail: drop primary to Qwen2.5-0.5B on mobile, or move mobile to a quantized 1B variant; document in build plan §2.

## Implementation sketch (not yet coded)
- Use `@xenova/transformers` (or ONNX Runtime Web) with `device: 'webgpu'`.
- Lazy-load model on first chat open; show download progress.
- Cache weights in Cache Storage / IndexedDB; evict on storage pressure.
- Feature-detect WebGPU: `if (!navigator.gpu) useFallback()`.

## Status
Spike not yet implemented. Blocked on dependency install (npm symlink limitation on /mnt/sdcard). Will be validated in CI or a writable dev environment.
