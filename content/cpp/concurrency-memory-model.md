# Concurrency and the C++ Memory Model

Modern C++ concurrency questions test whether you understand two levels at once: the language memory model and the underlying hardware consequences. On x86, many mistakes appear to work; on weaker architectures or under aggressive optimization, they fail. HFT systems are often highly concurrent but selectively synchronized: the best engineers know where sharing is unavoidable and where ownership partitioning eliminates it.

## Thread creation and management

`std::thread` starts a new thread of execution and must be either joined or detached before destruction; otherwise `std::terminate` is called.

```cpp
std::thread t([&] { run_feed_handler(); });
t.join();
```

`std::jthread` (C++20) improves this by joining automatically on destruction and integrating cooperative cancellation with `std::stop_token`.

```cpp
std::jthread t([](std::stop_token st) {
    while (!st.stop_requested()) {
        poll_once();
    }
});
```

`jthread` is often a safer default outside extremely specialized threading frameworks.

## Data races and undefined behavior

A data race occurs when two threads access the same memory location concurrently, at least one access is a write, and there is no happens-before relationship between them. In C++, a data race is undefined behavior, not merely a stale-read problem.

This is why “it works on my machine” is meaningless for racy code. The compiler may reorder or eliminate accesses assuming no races exist.

## Sequential consistency, acquire-release, relaxed

`memory_order_seq_cst` provides the strongest default semantics: atomic operations appear in one global total order consistent with each thread's program order. It is easiest to reason about but may constrain optimization more than necessary.

Acquire-release is the standard publication/consumption pair:
- a **release** store publishes prior writes;
- an **acquire** load that observes that store makes those prior writes visible in the acquiring thread.

Relaxed operations are atomic only for the object itself; they give no inter-thread ordering beyond modification order for that atomic. They are useful for counters, statistics, and some lock-free algorithms, but only when ordering is truly irrelevant or carried elsewhere.

## Happens-before and synchronizes-with

A **synchronizes-with** relationship is created by specific matching operations, such as a release store read by an acquire load on the same atomic, or unlocking a mutex followed by locking the same mutex.

**Happens-before** is broader. If A synchronizes-with B, then A happens-before B. Program-order sequencing within a thread also contributes. The key practical meaning: if write A happens-before read B, then B must observe A or a later overwrite.

## Memory barriers

Memory barriers or fences constrain reordering at compiler and/or hardware level. Their purpose is to make visibility and ordering explicit when atomic operation semantics alone are insufficient or when interfacing with special hardware/memory.

In idiomatic C++, prefer expressing ordering through atomic operations and locks rather than standalone fences unless the algorithm truly needs them.

## Mutexes and lock types

`std::mutex` provides mutual exclusion. `std::lock_guard` is the simplest RAII wrapper. `std::unique_lock` is more flexible: deferred locking, unlocking, and compatibility with condition variables.

`std::shared_mutex` allows multiple readers or one writer. It can help read-heavy workloads, but it is not a free win; write starvation and extra overhead can make it worse than a plain mutex under certain contention patterns.

## Condition variables

Condition variables allow threads to sleep until a condition becomes true.

```cpp
std::mutex m;
std::condition_variable cv;
std::queue<Event> q;

cv.wait(lock, [&] { return !q.empty(); });
```

Always wait in a loop or use the predicate overload because spurious wakeups are allowed. The condition variable does not store the condition; your shared state does.

## Practical HFT guidance

- Prefer ownership partitioning and message passing over fine-grained sharing.
- Keep lock scope tiny and data local.
- Avoid blocking primitives in the most latency-sensitive path when a single-producer/single-consumer design can eliminate them.
- Use atomics only when you can prove the ordering.
- On interviews, explain both correctness and latency implications.

## Interview questions with answers

**What is a data race in C++?**  
Concurrent conflicting accesses to the same memory location without synchronization; it yields undefined behavior.

**When would you use `std::jthread` over `std::thread`?**  
When you want RAII joining and cooperative cancellation support.

**What does acquire-release ordering guarantee?**  
If an acquire load observes a release store, all writes sequenced before the release become visible after the acquire.

**What is the difference between `synchronizes-with` and `happens-before`?**  
`synchronizes-with` is a specific cross-thread relation; `happens-before` is the broader ordering relation built from it and intra-thread sequencing.

**Why are relaxed atomics dangerous?**  
They prevent torn races on that atomic but do not create visibility/order guarantees for surrounding memory.

**Do mutexes imply memory ordering?**  
Yes. Unlocking synchronizes-with a subsequent successful lock on the same mutex, establishing visibility for protected data.
## Design heuristics

A good concurrency design starts by minimizing the number of shared writable locations. If a feed handler owns parsing and hands immutable messages to another stage, most memory-ordering complexity disappears. When synchronization is required, prefer one clear primitive per boundary: a mutex, a condition variable, or a well-specified atomic protocol, not an accidental mixture of all three.

In interviews, stating the invariant first and the primitive second is usually a strong signal of maturity.

