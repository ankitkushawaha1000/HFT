# Apple — Round 5: Onsite — Domain / Technical Depth

**What this round assesses:** Deep team-specific technical knowledge in audio, GPU, compiler, or browser systems.

## Format

1–2 rounds, 45–60 min each; discussion plus optional coding, highly team-specific.

## Representative questions

1. Core Audio: explain hard realtime constraints of an audio render callback and why allocations, locks, and syscalls are forbidden. `anecdotal + inferred`
2. Core Audio: implement a realtime-safe circular buffer between UI thread and audio callback using only `std::atomic`. `anecdotal`
3. Core Audio: explain sample rate, Nyquist theorem, FFT, and convolution reverb. `anecdotal`
4. Metal GPU: explain the Metal rendering pipeline and how it differs from OpenGL. `anecdotal + inferred`
5. Metal GPU: explain tile-based deferred rendering on Apple Silicon and why it benefits the architecture. `anecdotal`
6. Metal GPU: explain ARM Neon SIMD intrinsics and write a vectorized dot product. `anecdotal`
7. LLVM/Clang: explain LLVM IR and SSA form for optimization passes. `anecdotal + inferred`
8. LLVM/Clang: walk through how Clang handles a `constexpr` function at compile time vs. runtime. `anecdotal`
9. LLVM/Clang: explain `clang-tidy`, `clang-format`, and the Clang Static Analyzer. `anecdotal`
10. Safari/WebKit: explain browser rendering: DOM, CSSOM, layout tree, paint, composite. `anecdotal + inferred`
11. Safari/WebKit: explain JavaScript engine JIT compilation and IC stubs. `anecdotal`
12. Safari/WebKit: how would you profile a slow page render in Safari? `anecdotal`

## Sources

- https://developer.apple.com/metal/ `official`
- https://developer.apple.com/library/archive/documentation/MusicAudio/ `official`
- https://llvm.org/ `official`
- https://webkit.org/blog/ `official`
- Glassdoor Apple domain interview `anecdotal`
