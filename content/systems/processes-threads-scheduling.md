# Processes, Threads, and Scheduling

The Linux execution model matters in HFT because scheduling, affinity, and context switching directly affect latency variance. Senior interviews often probe whether you understand not just the APIs but their performance consequences and when you would isolate work into processes, threads, or user-space schedulers.

## `fork()` and `exec()`

`fork()` creates a new process by duplicating the calling process. The child gets a new PID and a logically separate address space, but modern kernels use copy-on-write, so pages are only copied when modified.

`exec()` replaces the current process image with a new program. A common Unix pattern is `fork()` followed by `exec()`.

For HFT systems, `fork()` is common in tooling, launchers, and daemons, but generally avoided inside memory-heavy or latency-critical runtime code because duplicating page tables and inheriting complex state can be expensive or risky.

## Threads: `pthreads` and `std::thread`

POSIX threads are the native Linux threading API. `std::thread` is the C++ wrapper, typically implemented over pthreads on Linux. Both create kernel-scheduled threads.

Use `std::thread` when writing modern C++ unless you specifically need pthread APIs for affinity, advanced attributes, or integration with lower-level libraries.

## Context switching cost

A context switch saves/restores register state, scheduler metadata, and often pollutes caches and TLB state. The raw switch overhead may be small, but the secondary cost from lost locality is often larger.

That is why a design with too many threads or too much contention can degrade even if CPU utilization looks moderate.

## CPU affinity

CPU affinity pins a thread or process to specific cores. Tools include `taskset` and the `sched_setaffinity` syscall/API.

Why it matters:
- reduces migration-induced cache loss;
- improves NUMA locality;
- isolates critical threads from noisy neighbors;
- makes latency measurements more stable.

Pinning alone is not enough; the corresponding memory and interrupts should also be locality-aware when possible.

## Real-time scheduling classes

Linux supports real-time classes such as `SCHED_FIFO` and `SCHED_RR`.

- `SCHED_FIFO`: runnable threads of a given priority run until they block, yield, or are preempted by a higher-priority real-time thread.
- `SCHED_RR`: similar, but with time slices among same-priority threads.

These can reduce latency jitter, but they are dangerous if misused. A runaway real-time thread can starve the machine. Good answers in interviews acknowledge both the benefit and the operational risk.

## Nice values and priorities

For normal scheduling classes, “nice” influences priority. Lower nice value means higher priority. This affects how CFS allocates CPU time, but it is not equivalent to real-time scheduling.

In practice, nice values can help background supporting processes yield to critical ones, but they do not guarantee low latency under all contention.

## Kernel threads vs user threads

Linux schedules kernel threads/entities. User-level threads or fibers are scheduled in user space on top of one or more kernel threads.

Kernel threads benefit from full OS integration and parallelism across cores, but incur kernel scheduling overhead. User threads can be cheaper to switch and useful for structured concurrency, but any blocking syscall can block the underlying kernel thread unless handled carefully.

## Green threads and coroutines

Green threads are user-space scheduled execution units. Modern C++20 coroutines are language support for suspending/resuming computations; they are not threads by themselves but can be used to implement cooperative concurrency.

Coroutines can reduce callback complexity and avoid some thread overhead, but they do not remove the need to reason about scheduling, ownership, and blocking behavior.

## HFT guidance

- Pin the most critical threads.
- Minimize involuntary context switches.
- Keep runnable thread count close to the amount of truly parallel work.
- Use real-time scheduling only with strong operational discipline.
- Know when a process boundary is worth the isolation cost.

## Interview questions with answers

**What does `fork()` copy?**  
It creates a new process with logically duplicated state, typically using copy-on-write pages rather than eagerly copying all memory.

**Why can context switches hurt latency beyond the switch itself?**  
They disrupt cache and TLB locality, which often dominates the direct scheduler overhead.

**Why set CPU affinity?**  
To reduce migration, preserve cache warmth, improve NUMA locality, and make latency more deterministic.

**What is the risk of `SCHED_FIFO`?**  
A runnable high-priority thread can starve normal work or even the whole machine if it does not block or yield appropriately.

**What is the difference between kernel threads and green threads?**  
Kernel threads are scheduled by the OS; green threads are scheduled in user space and rely on underlying kernel threads for execution.

**Are C++ coroutines a scheduling mechanism?**  
Not directly; they are a language mechanism for suspension/resumption that a runtime or framework can schedule.
## Operational cautions

Affinity and real-time priority are powerful but can backfire. Pinning multiple hot threads to sibling hyper-threads can increase contention; setting aggressive real-time priority without careful watchdogs can starve logging, monitoring, or even SSH access. In practice, scheduling policy belongs to system design and operations, not just to one isolated thread API call.

