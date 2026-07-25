# Measurement and Benchmarking for Low-Latency Systems

Research date: 2026-07-24

Low-latency engineering fails when measurement is sloppy. Benchmarking in HFT is not about publishing a flattering number; it is about learning whether a code path is deterministic, representative, and improvable. Senior engineers should assume that a benchmark is wrong until they can explain the clock source, workload shape, compiler settings, isolation strategy, and statistical treatment.

## Choose the right clock source

### `rdtsc` and invariant TSC

On modern x86 systems, `rdtsc` or `rdtscp` backed by an invariant TSC is often the lowest-overhead way to measure very short intervals. It provides cycle counts rather than wall-clock time. To convert cycles to time, you need a calibrated frequency or a stable nominal TSC frequency.

Important caveats:

- Older or heterogeneous systems may not provide synchronized counters across cores.
- Out-of-order execution can move `rdtsc`; use serialization or `rdtscp` carefully.
- Frequency scaling may not change invariant TSC, but turbo and sleep states still affect how cycle-based interpretations map to useful performance reasoning.

### `clock_gettime`

`clock_gettime(CLOCK_MONOTONIC_RAW, ...)` is slower than `rdtsc` but easier to reason about, more portable, and often sufficient when the measured region is not tiny. It is appropriate for end-to-end timing, system integration tests, and anything where instrumentation overhead is comfortably below the signal.

### HPET

HPET is usually too slow for tight microbenchmarks and can distort the measurement itself. It is historically important but rarely the best choice for HFT hot-path benchmarking unless required by a specific platform setup.

## Warmup is not optional

A benchmark that starts timing immediately often measures cache coldness, page faults, branch predictor training, code placement, and lazy initialization rather than steady-state logic. Warmup should populate instruction caches, data caches where relevant, allocator state, page tables, and any one-time static initialization.

Warmup does not mean hiding reality. If cold-start latency matters operationally, measure it separately. The mistake is mixing cold-start and steady-state behavior into one meaningless number.

## Coordinated omission

Coordinated omission occurs when the benchmark driver stops issuing work while the system is slow, thereby undercounting the worst waits. Suppose a target pauses for 10 milliseconds. A naive harness that issues the next request only after the prior one completes will record one bad sample instead of recording the many requests that would have accumulated during the stall.

This matters in HFT because bursty markets do not politely stop while your system stalls. Tools and harnesses should model an arrival process or at least account for the “missed” requests. HDR Histogram popularized methods and terminology here; the main lesson is to measure observed latency under realistic load generation, not a self-throttling loop.

## HDR Histogram and tail capture

An HFT engineer should be able to explain why a normal average plus standard deviation is inadequate for skewed latency distributions. HDR Histogram is useful because it stores a wide dynamic range with controlled precision and makes percentiles such as p99.9 and p99.99 cheap to compute.

Practical guidance:

- Record every sample, not just summary stats.
- Keep separate histograms for steady state, open/close bursts, and recovery scenarios.
- Compare runs with percentiles and full distributions, not only means.
- Export max and count as well; huge maxima can reveal misconfigurations even when percentile tails look acceptable.

## Steady state versus burst scenarios

A benchmark that processes one message at a time with no interference is only the starting point. HFT systems must also survive:

- **Open and close auctions or macro releases:** traffic bursts, gap recovery, and queue buildup.
- **Microbursts:** thousands of packets arriving in a very short interval.
- **Recovery storms:** replay plus live traffic.
- **Backpressure:** downstream consumers slower than upstream sources.

Steady-state numbers help with instruction-level optimization. Burst numbers tell you whether the architecture is resilient.

## Avoiding JIT and GC effects; C++-specific pitfalls

C++ avoids GC and JIT as primary runtime features, but it has its own benchmarking traps:

- The optimizer may remove dead code entirely.
- Loop-invariant work may be hoisted out of the timed region.
- Inlining can flatten call overhead, which may or may not reflect production.
- Small data sets fit in cache and produce unrealistically good results.
- Debug assertions or sanitizers can invalidate latency conclusions.

Use observable side effects, `benchmark::DoNotOptimize`, `benchmark::ClobberMemory`, volatile sinks when appropriate, and production-like compiler flags. Beware of benchmarking a function in isolation when the real cost in production is cache behavior across components.

## Using `--no-inline` and why it helps

Compilers aggressively inline hot code, which is often desirable in production. For microbenchmarks, temporarily using `--no-inline` or function attributes that inhibit inlining can be useful to understand call boundaries, isolate costs, and confirm whether a speedup comes from algorithmic improvement or merely inlining differences.

This flag is a diagnostic tool, not a production default. A good workflow is:

1. Benchmark with production-like optimization.
2. Re-run with inlining suppressed to inspect call-graph contributions.
3. Validate that the optimized result still exists in a larger end-to-end test.

## Statistical analysis that actually matters

Latency data is rarely normally distributed. Report at least:

- mean
- p50
- p95
- p99
- p99.9
- max
- sample count
- workload description

The mean is useful for capacity and coarse comparisons, but tails and spread are what drive low-latency engineering decisions. Use multiple runs, note variance between runs, and pin the test environment as tightly as possible.

## Common tools

### `rdtsc`-based timing

Use for ultra-short critical sections where function-call overhead from a clock API would dominate. Pair with CPU pinning and careful serialization.

```cpp
#include <x86intrin.h>
#include <cstdint>

inline std::uint64_t read_tsc() {
    unsigned aux;
    return __rdtscp(&aux);
}
```

### Google Benchmark

Google Benchmark is excellent for repeatable C++ microbenchmarks because it handles repetition, statistics, and anti-optimization helpers well.

```cpp
#include <benchmark/benchmark.h>

static void BM_Parse(benchmark::State& state) {
    FeedMessage msg{};
    for (auto _ : state) {
        benchmark::DoNotOptimize(parse_message(msg));
    }
}
BENCHMARK(BM_Parse);
BENCHMARK_MAIN();
```

It still needs disciplined use: pin cores externally, size inputs realistically, and separate functional correctness from performance measurement.

## Benchmark design checklist

1. Define the exact question: latency of what, under what conditions?
2. Choose a clock with known overhead.
3. Warm up code and memory.
4. Pin CPUs and control frequency scaling where possible.
5. Prevent optimization artifacts.
6. Measure burst and steady-state cases separately.
7. Record distributions, not just averages.
8. Reproduce on representative hardware.

## Interview questions with answers

### 1. When would you prefer `rdtsc` over `clock_gettime`?
Use `rdtsc` for extremely short code paths where clock call overhead would be material, provided the platform has a stable, synchronized invariant TSC and the measurement is carefully serialized. Use `clock_gettime` for portability and easier reasoning at coarser boundaries.

### 2. What is coordinated omission?
It is the under-reporting of latency when the workload generator pauses during stalls and therefore fails to account for requests that would have arrived while the system was slow. It makes tail latency look artificially better than it is.

### 3. Why do warmups matter in C++ if there is no JIT?
Because caches, branch predictors, page tables, allocators, and lazy initialization still need to settle. Without warmup, you mix startup artifacts with the steady-state path you actually care about.

### 4. Why might `--no-inline` be useful in benchmarking?
It helps isolate function-level costs and validate whether an apparent improvement is algorithmic or simply due to inlining. It is a diagnostic knob, not a production recommendation.

### 5. What metrics would you report for a benchmark?
At minimum: mean, p50, p95, p99, p99.9, max, sample count, workload description, environment details, and whether the results came from steady state or burst tests.
