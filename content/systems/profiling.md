# Profiling and Benchmarking Methodology

Performance work without methodology turns into folklore. Senior HFT engineers are expected to know not just the tools, but how to avoid lying to themselves with bad measurement. The goal is to produce data that survives skepticism.

## `perf`: `stat`, `record`, `report`, `annotate`

`perf stat` gives aggregate counters: cycles, instructions, branches, branch misses, cache misses, context switches, migrations, and more. It is the fastest way to build a first cost model.

`perf record` samples execution; `perf report` attributes samples to functions and call stacks; `perf annotate` shows source/assembly with samples mapped onto instructions.

A strong workflow is: start with `perf stat`, then drill into hotspots with `record/report`, then inspect instruction-level behavior with `annotate`.

## `strace`

`strace` is invaluable when performance issues involve kernel interaction: blocking I/O, too many `futex` waits, syscall storms, or accidental file/socket churn. It is not a CPU profiler, but it often answers “why is this thread sleeping?” faster than any other tool.

## Benchmarking methodology

Good methodology includes:
- warmup to stabilize caches, code pages, and branch predictors;
- multiple runs, not one heroic sample;
- robust statistics: median plus tail percentiles, not just average;
- controlled environment: pinned CPUs, limited background noise, fixed frequency policy where possible;
- realistic inputs and working-set sizes.

In low-latency domains, p99 and above are often more important than mean throughput.

## Coordinated omission

Coordinated omission, explained famously by Gil Tene, occurs when the measurement process fails to sample the periods when the system is already late, thereby understating latency. If your load generator waits for each request to complete before sending the next, it can hide stalls.

The lesson: generate load independently of response latency when measuring service latency, or otherwise account for omitted delays.

## HDR Histogram

HDR Histogram is widely used for recording latency over a large dynamic range with controlled precision. It is ideal for HFT-adjacent benchmarking because it preserves high-percentile structure far better than simplistic averaging or coarse buckets.

## Common benchmarking mistakes

- benchmarking debug builds;
- ignoring CPU affinity and migration;
- measuring too little work per sample;
- not separating startup cost from steady-state behavior;
- allowing dead-code elimination;
- comparing variants under different data distributions;
- ignoring the observer effect of instrumentation.

## Microbenchmarking vs end-to-end

Microbenchmarks are useful for understanding isolated primitives: allocator cost, queue push/pop, parser loop structure. End-to-end benchmarks capture queueing, cache interactions, syscalls, NIC behavior, and contention.

You need both. Microbenchmarks guide local choices; end-to-end tests validate that those local wins matter in the full system.

## Interview questions with answers

**Why start with `perf stat`?**  
It quickly reveals whether the workload is compute-bound, branch-mispredict-heavy, cache-miss-heavy, or scheduler-disturbed.

**What is coordinated omission?**  
A measurement artifact where latency sampling hides long pauses because the load generator stops generating work while the system is already late.

**Why is p99 often more important than average in HFT?**  
Tail latency reflects worst-case competitiveness and operational risk that averages can hide.

**What does HDR Histogram provide?**  
Efficient, high-fidelity latency recording across a wide dynamic range with good percentile accuracy.

**Why can microbenchmarks mislead?**  
They may omit real contention, cache effects, I/O, batching, and queueing present in the full system.

**Why use `strace` in performance work?**  
To identify blocking syscalls and kernel interactions that pure CPU profilers do not explain.
## A defensible workflow

1. Reproduce under controlled load.
2. Use `perf stat` to classify the bottleneck.
3. Use `perf record/report` to identify hot code paths.
4. Correlate with application-level latency histograms.
5. Re-run after every change under the same conditions.

This method prevents the classic mistake of “fixing” a metric that was never actually driving end-to-end latency.

## Reporting results

A credible performance report states workload, hardware, kernel, compiler flags, affinity policy, warmup procedure, sample size, median, and tail percentiles. Without that context, comparison numbers are nearly meaningless.

## Tail-focused thinking

In HFT, a “faster average” can still be a worse system if the p99 or p999 regresses. Always inspect histogram shape, not just one summary number. Queueing, GC-free allocator refill events, page faults, or occasional lock contention often show up first in the tail.

## Sanity checks before trusting numbers

Confirm CPU frequency policy, isolate noisy neighbors, verify the same binary and config for all runs, and ensure the benchmark is not accidentally measuring logging or startup work. The more surprising the result, the more aggressively you should audit the measurement setup before changing code.

## Communicating conclusions

Senior engineers do not stop at “function X is hot.” They explain whether the bottleneck is compute, memory, kernel interaction, or synchronization, estimate the likely upside of fixing it, and describe how they will validate that the improvement survives end-to-end latency measurement.

Benchmark credibility comes from reproducibility, not from a single impressive screenshot or one lucky run. Always document variance.
