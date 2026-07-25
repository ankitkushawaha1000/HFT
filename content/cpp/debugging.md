# C++ Debugging Guide

Senior debugging is about shortening the loop from symptom to mechanism. In C++, that means being comfortable moving between source, stack traces, memory tools, assembly, and runtime state. HFT interviews often ask not just “what is ASan?” but “how would you isolate a 20-microsecond regression or an intermittent crash in a multithreaded feed handler?”

## `gdb` basics

Essential commands:
- `break file.cpp:123` or `break func`
- `run`, `continue`, `next`, `step`, `finish`
- `bt` for backtrace
- `frame N`, `info locals`, `print expr`
- `watch expr` and `rwatch expr` for watchpoints
- `thread apply all bt` for multi-threaded crashes

Hardware watchpoints are especially useful for finding unexpected writes to a variable or object field.

## Valgrind Memcheck

Valgrind Memcheck instruments memory accesses to detect leaks, invalid reads/writes, use of uninitialized values, and some lifetime issues.

```bash
valgrind --tool=memcheck --leak-check=full ./app
```

It is much slower than native execution, so it is best for targeted reproductions, not production-like latency measurement.

## AddressSanitizer

AddressSanitizer is usually the fastest first tool for memory safety bugs.

Typical build flags:

```bash
clang++ -fsanitize=address -fno-omit-frame-pointer -g app.cpp
```

ASan catches heap/stack/global out-of-bounds, use-after-free, double-free, and more, with highly actionable reports.

## ThreadSanitizer

ThreadSanitizer detects data races and synchronization mistakes.

```bash
clang++ -fsanitize=thread -g app.cpp
```

TSan can produce false positives around custom synchronization primitives unless properly annotated, but for ordinary threaded code it is extremely valuable.

## Reading assembly

Sometimes the bug is “the compiler did exactly what the standard allowed.” Reading generated assembly reveals whether a branch disappeared, a load was hoisted, or an inline path exploded in size.

Useful techniques:
- compile with `-S` to emit assembly;
- use `objdump -d -C` on binaries;
- compare variants on Compiler Explorer (godbolt.org) for instruction-level reasoning.

Assembly reading is also crucial for verifying vectorization and diagnosing missed optimization opportunities.

## Core dumps

Core dumps capture a process image at crash time.

```bash
ulimit -c unlimited
gdb ./app core.1234
```

In `gdb`, inspect the crashing thread, registers, signal, stack, and nearby memory. For production incidents, preserving matching binaries and debug symbols is essential; a core dump without symbols is often only partially useful.

## Debugging multi-threaded programs

Multithreaded failures require attention to interleavings. Practical steps:
- reduce the reproducer while preserving timing characteristics;
- inspect all thread stacks;
- add thread IDs and timestamps to logs;
- use watchpoints on shared state;
- run TSan or stress loops under CPU pinning;
- check for lifetime bugs disguised as race bugs.

Many “race conditions” are actually ownership/lifetime violations.

## Remote debugging

Remote debugging matters when the target environment differs from the developer workstation or when reproducing on colocated or restricted hosts.

Common patterns:
- `gdbserver` on the target, `gdb` on the host;
- symbol files stored centrally;
- perf captures and core dumps collected from the target for offline analysis.

In latency-sensitive systems, you often cannot attach invasive tooling to the live production process, so offline artifacts become the primary debugging mechanism.

## Practical workflow

1. Reproduce under the highest-signal tool that preserves the bug.
2. Decide whether the issue is memory safety, race/synchronization, logic, or performance.
3. Use sanitizers before deep manual reasoning when possible.
4. Inspect optimized builds if the bug is optimization-sensitive.
5. Keep symbolized crash artifacts and exact build provenance.

## Interview questions with answers

**When would you choose ASan over Valgrind first?**  
Usually first, because it is much faster and integrates well into normal test runs while catching many important memory bugs.

**What is a watchpoint useful for?**  
Detecting when a memory location changes, which is ideal for tracking unexpected writes.

**Why inspect assembly during debugging?**  
To verify what code actually runs after optimization and whether compiler transformations explain the observed behavior.

**What does TSan find?**  
Data races and many synchronization errors in threaded code.

**Why are core dumps valuable?**  
They preserve crash-time process state for postmortem analysis without requiring a live reproducer.

**How do you debug an intermittent multithreaded crash?**  
Combine reproducibility work, thread stack inspection, sanitizers, logging, watchpoints, and production-like symbolized artifacts.
## Production incident discipline

For crash or latency incidents, preserve the exact binary, debug symbols, kernel version, command-line flags, configuration, and input sample if possible. “Works on my build” is often meaningless when optimization, inlining, allocator behavior, or CPU features differ.

A senior engineer should also know when **not** to attach a debugger to a live critical process because the observer effect may worsen the incident. In those cases, perf samples, logs, cores, and packet captures are safer first artifacts.

## Fast triage checklist

For a crash: get the core, symbolized backtrace, faulting instruction, and recent logs. For a latency spike: capture `perf stat`, scheduler activity, packet rates, and queue depths at the same time window. For corruption: run the smallest reproducer under ASan/TSan before editing code. That discipline prevents random debugging thrash.
