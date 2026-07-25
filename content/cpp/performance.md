# C++ Performance Optimization

Performance engineering in C++ is about building a cost model and then validating it with measurements. Senior candidates are expected to know both compiler-level and hardware-level effects: allocation, branches, caches, vectorization, syscalls, and optimizer behavior. In HFT, the winning approach is usually “simplify the hot path until the machine has very little choice but to run it fast.”

## Optimization levels

`-O0` preserves source structure for debugging but is a terrible proxy for runtime behavior. `-O2` enables broad optimization and is often the right baseline. `-O3` adds more aggressive inlining, loop transforms, and vectorization heuristics. `-Os` optimizes for size, which sometimes improves instruction-cache behavior.

Always benchmark close to production flags. Debug performance measurements are mostly noise.

## Inlining

Inlining removes call overhead and may unlock constant propagation and dead-code elimination across boundaries. But over-inlining can bloat code and hurt I-cache and branch prediction.

`inline` in C++ is primarily an ODR/linkage keyword, not a command to the optimizer. Compiler-specific attributes can encourage or discourage inlining, but use them sparingly and only after profiling.

## Branch prediction and branch-free code

Branch mispredictions can cost far more than a simple arithmetic instruction. Highly predictable branches are cheap; unpredictable branches in a market-data feed parser or matching path are not.

Branch-free code can help, but only when it actually reduces mispredictions without increasing instruction count, dependencies, or register pressure too much. “Branchless” is not a synonym for “faster.”

## Profiling tools

- `perf`: low-overhead Linux profiling for cycles, branches, cache misses, and annotated assembly.
- `gprof`: historical, less useful for modern low-level work.
- Intel VTune: deeper microarchitectural analysis and threading insight.

Use sampling first. Instrumentation can perturb the system.

## Memory access patterns and cache friendliness

Memory dominates many workloads. Contiguous data, predictable strides, and compact structures improve cache hit rate and TLB behavior. Pointer-chasing, scattered allocations, and large working sets create latency spikes.

Typical wins:
- transform array-of-structs to struct-of-arrays when vectorization or selective field access dominates;
- reserve container capacity;
- avoid false sharing;
- partition read-mostly and write-heavy data.

## Loop optimizations

Important loop transforms include unrolling, vectorization, invariant hoisting, fusion/fission, and strength reduction. Compilers perform many automatically, but clear code, alignment, aliasing information, and simple bounds help them.

Manual unrolling is rarely the first step. Start by making the loop easy for the compiler and the cache.

## `constexpr` computation

Compile-time computation can move work out of the runtime path entirely: lookup tables, protocol masks, dispatch metadata, and fixed numeric transforms. But excessive template/`constexpr` machinery can harm build times and binary size, so use it where it removes real runtime work.

## Benchmarking with care

Benchmarking mistakes are common:
- measuring too little work;
- not warming caches or the branch predictor;
- allowing dead-code elimination to erase the code under test;
- ignoring variance and tail latency;
- benchmarking isolated code that behaves differently end-to-end.

Use realistic inputs, pin CPUs when appropriate, keep the benchmark harness honest, and inspect generated assembly for suspicious optimization artifacts.

```cpp
auto start = std::chrono::steady_clock::now();
do_not_optimize(run_parser(batch));
auto end = std::chrono::steady_clock::now();
```

The exact anti-optimization mechanism depends on the framework or compiler.

## HFT-specific heuristics

- Eliminate dynamic allocation from the hot path first.
- Minimize cache misses before micro-tuning arithmetic.
- Treat p99 and p999 latency as first-class metrics.
- Keep the hot path branch-predictable and ownership-local.
- Regress performance automatically; anecdotes are not data.

## Interview questions with answers

**Why is `-O0` a poor benchmark target?**  
It disables most optimizations, drastically changing code shape, inlining, register allocation, and memory behavior.

**When can inlining hurt performance?**  
When code growth increases I-cache pressure or disrupts optimizer heuristics more than call overhead savings justify.

**Why are caches more important than big-O in many systems loops?**  
Because constant factors driven by locality and memory latency dominate realistic data sizes on modern CPUs.

**What is a branch misprediction?**  
The CPU speculates down the wrong control path and must flush/recover, wasting cycles.

**How do you stop the compiler from optimizing away a benchmark?**  
Use a proper benchmark framework or explicit compiler barriers/escape hooks so the result is observed.

**What should you optimize first in an HFT path?**  
Usually allocations, cache misses, and unnecessary sharing before exotic instruction-level tricks.
## Practical optimization workflow

First identify the hot function, then the hot instructions, then the hot data. If the top cost is allocator churn, do not start with branch hints. If the top cost is LLC misses, do not debate arithmetic strength reduction. The winning sequence is usually: remove obvious work, reduce memory traffic, simplify control flow, then revisit instruction-level tuning.

That prioritization is a strong interview answer because it shows you optimize by evidence rather than folklore.

## One interview soundbite

Performance work is a queue of hypotheses to kill with data, not a chance to demonstrate cleverness.
