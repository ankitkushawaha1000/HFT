# Synchronization Primitives

Synchronization is about coordinating access to shared state without losing correctness or wasting too much latency budget. Senior interviews typically ask not only what primitives exist, but when each is appropriate and what kernel/hardware behavior sits beneath the abstraction.

## Mutexes

`std::mutex` provides exclusive ownership. `std::recursive_mutex` allows the same thread to acquire repeatedly, but it usually signals a design smell because it hides reentrancy issues and complicates reasoning.

The usual best practice is simple RAII locking with `std::lock_guard` or `std::unique_lock` and minimal critical sections.

## Semaphores

A semaphore maintains a count of available permits. It is useful for producer-consumer coordination, bounded-resource pools, and wakeup control without transferring ownership of a specific mutex-protected invariant.

In modern C++, counting semaphores are available in the standard library. Semaphores express availability, not mutual exclusion.

## Futex internals

A futex (“fast userspace mutex”) is a Linux primitive that allows uncontended locking paths to stay in user space and only enter the kernel when blocking/waking is needed. Many mutex and condition-variable implementations are built on futexes.

This hybrid fast path is why uncontended mutexes can be very cheap while contended ones still involve scheduler interaction.

## Condition variables

Condition variables let threads sleep until some predicate becomes true. They are always paired with shared state and a mutex.

Key rules:
- the predicate lives in your shared state, not in the condition variable;
- always wait in a loop or use the predicate overload;
- notify after making the state change visible.

## Read-write locks

Read-write locks allow many concurrent readers or one writer. They help when reads are numerous, long enough to amortize overhead, and truly compatible. They hurt when writes are frequent, reader sections are tiny, or fairness causes contention pathologies.

In many low-latency systems, versioned snapshots or RCU-like designs beat read-write locks for read-mostly data.

## Spinlocks vs sleeping locks

A spinlock busy-waits until available; a sleeping lock blocks and lets the scheduler run something else. Spinlocks can be good for extremely short critical sections under controlled contention, especially when sleeping would cost more than waiting. They are bad under oversubscription or long hold times because they waste CPU and amplify jitter.

Sleeping locks are safer for general-purpose contention but incur scheduler latency when threads block.

## Lock-free coordination

Lock-free coordination uses atomics and careful protocols instead of mutex blocking. It can reduce wakeup latency and avoid some scheduler effects, but memory ordering, ABA, reclamation, and fairness become much harder. The correct default is not “lock-free everywhere” but “share less.”

## Deadlock

Deadlock requires four conditions: mutual exclusion, hold-and-wait, no preemption, and circular wait. Prevention strategies include:
- fixed lock ordering;
- acquiring multiple locks atomically with library helpers;
- minimizing lock nesting;
- timeouts or backoff in selected cases.

Detection in production often relies on watchdogs, lock instrumentation, or stack sampling rather than magic kernel support.

## Livelock and starvation

**Livelock**: threads keep changing state and responding to each other but no useful progress occurs.  
**Starvation**: one thread waits indefinitely while others keep succeeding.

Lock-free and backoff-heavy designs can avoid deadlock yet still suffer starvation.

## HFT guidance

- Prefer ownership partitioning and message passing.
- Use mutexes confidently for non-hot shared control state.
- Keep hot critical sections tiny and aligned with cache ownership.
- Choose read-write locks only when read-mostly patterns are proven.
- Beware spinlocks on oversubscribed or noisy systems.

## Interview questions with answers

**What problem does a semaphore solve that a mutex does not?**  
It tracks resource availability counts rather than exclusive ownership of a critical section.

**Why are futexes important?**  
They let uncontended synchronization stay in user space while still supporting kernel-assisted blocking when needed.

**When is a spinlock appropriate?**  
For extremely short waits under controlled contention and dedicated CPU conditions.

**Why can read-write locks underperform?**  
Extra bookkeeping, fairness issues, and write pressure can outweigh parallel-read benefits.

**What are the four deadlock conditions?**  
Mutual exclusion, hold-and-wait, no preemption, and circular wait.

**How is livelock different from deadlock?**  
In livelock the system remains active but makes no useful progress; in deadlock it is blocked waiting.
## Review heuristics

    When reading concurrent code, first identify who owns each mutable datum. If ownership is shared, identify the exact primitive guarding it and the invariant protected by that primitive. Only then reason about performance. Many bugs come from code that mixes atomics, locks, and condition variables around the same state without a single clear contract.

That clarity is often what distinguishes senior systems code from merely working code.

## One interview pattern

If you are unsure which primitive to choose, describe the data-access pattern first: single owner, many readers, bursty producer-consumer, or contended shared state. The primitive usually follows naturally from the pattern.

## Performance note

The fastest synchronization primitive is often elimination of shared mutable state. Every primitive should be evaluated not only on uncontended microbenchmark cost, but on contention behavior, fairness, cache traffic, and failure-mode simplicity.
