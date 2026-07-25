# Allocators and Memory Management

In HFT, custom memory management is not academic. General-purpose allocators are optimized for broad workloads, not necessarily for single-producer queues, protocol object churn, or strict latency jitter budgets. The core reason custom allocators matter is not just mean speed but predictability: fewer syscalls, less fragmentation, less lock contention, and tighter control over locality.

## The standard allocator model

The classic allocator concept provides a way for containers to obtain and release raw storage and construct/destroy elements. Historically, allocators exposed nested typedefs and rebind behavior; modern containers mostly rely on `allocator_traits` to normalize interfaces.

A minimal allocator needs to allocate and deallocate correctly aligned storage for `T`. Construction and destruction are now generally routed through traits or library helpers rather than custom member functions.

## Allocator-aware containers

Standard containers such as `std::vector`, `std::map`, and `std::unordered_map` are allocator-aware. They propagate allocators according to specific traits and rules on copy/move/swap. Senior candidates should understand that allocator choice can influence:
- where storage comes from;
- whether move operations are cheap;
- whether a swap is constant time;
- whether memory locality matches thread ownership.

Incorrect assumptions about allocator propagation are a source of surprising complexity in larger systems.

## Polymorphic allocators and `pmr::memory_resource`

C++17 introduced polymorphic allocators in `<memory_resource>`. Instead of making the allocator type part of the container type, a `std::pmr::*` container uses a runtime-selected `memory_resource`.

```cpp
std::byte buffer[4096];
std::pmr::monotonic_buffer_resource arena(buffer, sizeof(buffer));
std::pmr::vector<int> v{&arena};
```

Benefits:
- simpler APIs: `pmr::vector<T>` rather than `vector<T, SomeAllocator<T>>`;
- easy swapping of resource strategies;
- better composability across subsystems.

The tradeoff is an extra level of indirection through virtual dispatch in the resource interface, though many workloads amortize it well.

## Memory pool allocator design

A pool allocator typically pre-allocates chunks and serves fixed-size objects from free lists. Design choices include:
- object size class strategy;
- per-thread vs shared pools;
- free-list metadata placement;
- recycling behavior and cache locality;
- debugging hooks and poisoning.

Pool allocators shine when allocation sizes are homogeneous and object lifetimes are frequent and short, such as order/event wrappers or tree nodes.

## Arena / monotonic allocator

An arena, often monotonic, allocates by bumping a pointer. Individual deallocation usually does nothing; the entire arena resets at once.

This is extremely fast and locality-friendly. It is ideal for phase-based workloads: parse a message batch, build temporary objects, then discard all at once.

Downsides:
- no fine-grained free;
- memory can only grow until reset;
- accidental retention of arena-backed objects past arena lifetime is catastrophic.

## Stack allocator

A stack allocator also uses bump allocation, but with LIFO deallocation discipline. It works when allocations and frees are perfectly nested. This can be effective in recursive algorithms, parser stacks, or deterministic scoped temporary storage.

Violating LIFO assumptions usually means corruption or expensive fallback logic, so this design requires strong discipline.

## Why this matters in HFT

`malloc`/`free` may take locks, touch metadata spread across cache lines, or interact with the kernel for large or fragmented heaps. Even when fast on average, they can introduce tail latency.

Custom allocators matter because they can:
- keep hot allocations thread-local;
- preserve NUMA locality;
- avoid unpredictable fragmentation;
- eliminate per-object frees via batch reset;
- make capacity and failure modes explicit.

A common pattern is allocating all session or strategy state from a dedicated arena during initialization and keeping the trading path allocation-free.

## `std::pmr::vector` and friends

`std::pmr::vector`, `std::pmr::string`, `std::pmr::unordered_map`, and others are aliases using `std::pmr::polymorphic_allocator`. They are useful when you want allocator control without infecting every function signature with allocator template parameters.

`pmr` is especially attractive for message decoding pipelines: multiple containers can share one arena resource so a whole decode context is reclaimed cheaply.

## Design cautions

- Allocation speed is meaningless if deallocation or reuse breaks locality.
- Per-thread pools reduce contention but can worsen memory footprint.
- Cross-thread deallocation needs a plan.
- Instrumentation matters: track high-water marks, refill counts, and fallback allocations.
- Always define failure behavior. In a trading system, silent fallback to global heap can invalidate latency assumptions.

## Interview questions with answers

**Why use a custom allocator in HFT?**  
To reduce allocator overhead and jitter, improve locality, minimize contention, and make memory behavior more predictable.

**What is an arena allocator best for?**  
Phase-based lifetimes where many objects are allocated together and discarded together.

**What is the benefit of `pmr`?**  
Runtime-selectable allocation strategy with allocator-aware containers that are easier to compose than custom allocator template types.

**What is the downside of monotonic allocation?**  
Individual frees are impossible or no-ops, so memory usage only grows until the whole arena resets.

**Why are allocator propagation rules important?**  
They affect whether moves/swaps stay cheap and whether memory ownership semantics remain correct across container operations.

**Would you always replace `malloc` with a custom pool?**  
No. Only where the allocation pattern is understood and measured; complexity without workload fit is a net loss.
