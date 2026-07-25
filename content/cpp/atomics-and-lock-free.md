# Atomics and Lock-Free Programming

Atomics are the foundation of low-level concurrency in C++. Senior interviews at trading firms often probe whether you can distinguish “atomic,” “lock-free,” and “wait-free,” and whether you understand the memory-ordering contract well enough to build or review queueing primitives safely.

## `std::atomic` and its guarantees

`std::atomic<T>` provides indivisible operations on an object of type `T` subject to type restrictions and implementation support. It prevents data races on that object when used correctly and lets you specify memory ordering.

It does **not** automatically make larger invariants atomic. If two variables must change consistently, atomics on each variable may still be insufficient without a protocol.

Some atomic types are lock-free on a given platform, others may use internal locks. You can query with `is_lock_free()`.

## Memory ordering options

- `seq_cst`: strongest, globally ordered, easiest to reason about.
- `acquire`: for loads that consume a published state.
- `release`: for stores that publish prior writes.
- `acq_rel`: read-modify-write operations that both acquire and release.
- `relaxed`: atomicity only, no ordering for surrounding memory.

Choose the weakest ordering that is obviously correct, not the weakest ordering you can barely justify. In many production systems, `seq_cst` is fine until measurement proves otherwise.

## `compare_exchange_strong` vs `compare_exchange_weak`

Compare-and-exchange updates an atomic only if its current value matches an expected value. On failure, the expected value is overwritten with the actual current value.

`compare_exchange_weak` may fail spuriously even when the values match, so it is typically used inside a retry loop and may map more naturally to some hardware.

`compare_exchange_strong` does not have spurious failure, but can still fail normally when another thread changed the value.

```cpp
while (!head.compare_exchange_weak(expected, desired,
                                   std::memory_order_release,
                                   std::memory_order_relaxed)) {
    // expected updated; retry
}
```

## ABA problem

ABA means a pointer or value changes from A to B and back to A. A compare-and-exchange observing A may incorrectly conclude “nothing changed,” even though the underlying state went through a dangerous intermediate transition.

This matters in lock-free stacks and freelists. Common mitigations include version tagging, hazard pointers, epochs, or avoiding immediate node reuse.

## Lock-free SPSC queue concept

A single-producer/single-consumer ring buffer is the canonical HFT lock-free structure. One thread owns the write index; one owns the read index. Shared communication is reduced to publishing indices, often with acquire/release ordering.

The design works well because contention is structurally limited and false sharing can be avoided by separating indices onto different cache lines.

## Lock-free != wait-free

- **Lock-free**: system-wide progress is guaranteed; at least one thread makes progress.
- **Wait-free**: every operation completes in a bounded number of steps.

Wait-free is stronger and harder. A lock-free structure can still starve one thread under contention.

## Hazard pointers concept

Hazard pointers are a safe memory-reclamation scheme for lock-free structures. A thread announces which nodes it might dereference, preventing reclamation of those nodes until no hazard pointer references them.

This solves the classic issue that removing a node atomically is not enough; you also need to know when it is safe to free the memory without another thread still reading it.

## When to use `seq_cst` vs acquire/release

Use `seq_cst` when:
- correctness is primary and the algorithm is not obviously bottlenecked by ordering strength;
- debugging simplicity matters;
- the synchronization graph is complex.

Use acquire/release when:
- you have a clear publication pattern;
- the algorithm is well understood;
- measurement shows ordering cost or compiler freedom matters.

Relaxed ordering is appropriate only when the value is logically independent of other data or when another mechanism provides the needed ordering.

## Practical rules

1. Prefer simple ownership partitioning over lock-free cleverness.
2. If you choose lock-free, design memory reclamation first, not last.
3. Pad atomics to avoid false sharing.
4. Use formal reasoning, not intuition.
5. Verify with stress tests and ThreadSanitizer where applicable, while remembering TSan does not prove lock-free algorithm correctness.

## Interview questions with answers

**What does `std::atomic` guarantee?**  
Atomic access to that object without data races, plus configurable ordering semantics; it does not make compound invariants automatically safe.

**Why would `compare_exchange_weak` fail spuriously?**  
Some architectures implement CAS-like primitives that may report failure even when the observed value matched, so weak CAS is designed for retry loops.

**What is the ABA problem?**  
A compare-exchange sees the same value again after an intervening change, masking a dangerous state transition.

**Why is memory reclamation hard in lock-free structures?**  
Removing a node from the structure does not prove no other thread still holds a pointer to it.

**Is lock-free always faster than mutex-based code?**  
No. Complexity, cache contention, retries, and memory reclamation can make lock-free slower or less predictable.

**Why is SPSC much easier than MPMC?**  
Ownership of producer and consumer indices is unambiguous, reducing contention and synchronization complexity.
## Common production mistakes

1. Using atomics to “sprinkle safety” onto a design whose ownership model is unclear.
2. Forgetting that relaxed atomics do not publish associated payload data.
3. Benchmarking a lock-free queue at low contention and assuming the same win under burst load.
4. Ignoring NUMA placement and false sharing around queue metadata.

A senior answer should emphasize that most successful low-latency systems are *ownership-oriented first* and lock-free second. Atomics are powerful, but the simplest design that eliminates sharing usually wins.

