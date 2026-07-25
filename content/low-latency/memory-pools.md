# Memory Pools and Allocation-Free Code

Research date: 2026-07-24

Dynamic memory allocation is not inherently evil, but in HFT hot paths it is often a source of unpredictable latency, cache disruption, lock contention inside allocators, and difficult-to-control fragmentation. Senior engineers should think of allocation strategy as part of system architecture, not a minor implementation detail.

## Why `malloc` can be expensive in HFT

General-purpose allocators are designed for flexibility across many allocation sizes, lifetimes, and threads. That flexibility comes with metadata management, free-list operations, synchronization, page acquisition, and fragmentation behavior. Even when the average allocation is “fast,” the tail can be bad due to contention, page faults, or arena growth.

The deeper issue is unpredictability. A strategy path that allocates on every message is effectively delegating latency control to a subsystem optimized for general applications.

## Pre-allocation strategy

A common HFT approach is to pre-allocate all hot-path memory at startup or session initialization. The system determines the worst-case number of objects that may be in flight—orders, book events, decoded messages, strategy work items—and reserves space up front.

Advantages:

- stable memory footprint during trading
- no page faults from late allocation if pages are touched during warmup
- better control over NUMA placement
- simpler failure modes; exhaustion is explicit

Pre-allocation should be paired with startup warmup that touches pages so the operating system maps them before live trading.

## Fixed-size pool allocator design

A pool allocator serves requests from a store of equal-sized blocks. It is ideal when the system repeatedly allocates objects of one known size, such as order objects or feed events.

Basic design:

- reserve a large backing buffer
- partition it into blocks
- maintain a free list of available blocks
- `allocate()` pops a block
- `deallocate()` returns it to the list

Because block size is fixed, there is no external fragmentation within the pool and metadata can be tiny.

```cpp
#include <cstddef>
#include <new>

class FixedPool {
public:
    explicit FixedPool(void* memory, std::size_t block_size, std::size_t count)
        : free_(memory) {
        auto* p = static_cast<std::byte*>(memory);
        for (std::size_t i = 0; i + 1 < count; ++i) {
            *reinterpret_cast<void**>(p + i * block_size) = p + (i + 1) * block_size;
        }
        *reinterpret_cast<void**>(p + (count - 1) * block_size) = nullptr;
    }

    void* allocate() {
        if (!free_) return nullptr;
        void* block = free_;
        free_ = *reinterpret_cast<void**>(free_);
        return block;
    }

    void deallocate(void* block) {
        *reinterpret_cast<void**>(block) = free_;
        free_ = block;
    }

private:
    void* free_;
};
```

In production, add alignment handling, ownership rules, bounds validation where appropriate, and thread-affinity design. Many pools are deliberately single-threaded or per-core.

## Arena allocators and bump pointers

An arena allocator is even simpler when objects share a common lifetime. A bump pointer moves forward through a contiguous region; individual deallocation does not exist. The whole arena is reset at once.

This is excellent for:

- per-batch parsing scratch space
- temporary objects during simulation ticks
- request-scoped workspaces

Arena allocation is close to optimal in throughput and predictability because it mostly increments a pointer. Its limitation is lifetime granularity: if objects die at very different times, arena reset is wasteful.

## Slab allocator concept

A slab allocator maintains multiple caches of objects or blocks for different fixed sizes. Think of it as several pools, often with constructor-friendly semantics and good cache locality. Slabs are useful when the hot path needs a few object classes of distinct sizes without paying the cost of a general allocator.

In latency-sensitive systems, slab-like approaches are often combined with per-thread caches to avoid cross-core contention.

## Zero-copy techniques

Zero-copy does not mean literally zero movement of bits everywhere; it means avoiding unnecessary copies at layers you control. Common techniques include:

- pass pointers, spans, or views instead of copying payloads
- parse in place when protocol format allows it
- store references to immutable buffers rather than duplicating fields
- use scatter-gather I/O for transmission when appropriate
- hand off ownership of pre-allocated buffers between pipeline stages

The key is lifecycle discipline. Zero-copy designs fail if ownership is ambiguous and consumers retain pointers longer than expected.

## Avoiding copies in the hot path

Copies cost more than raw memory bandwidth. They also evict cache lines, increase write traffic, and create more objects to manage. Practical habits include:

- use move semantics only when ownership transfer is real and cheap
- keep hot structs compact and trivially copyable when possible
- avoid string allocation or formatting on the critical path
- separate control metadata from large payloads
- avoid queueing large objects by value

A useful review question is: “Can this stage publish an index, pointer, or handle instead of a whole object?”

## Stack allocation versus heap allocation

Stack allocation is usually faster and more predictable because it is just pointer movement in thread-local memory. It is excellent for small temporary objects with clear lexical lifetime. But large stack objects can hurt cache locality or risk stack exhaustion, and stack lifetime is too short for many asynchronous workflows.

Heap allocation is necessary for dynamic lifetimes, but the hot path should minimize it or funnel it through controlled allocators. The real goal is not “stack good, heap bad”; it is “make allocation lifetime explicit and predictable.”

## Engineering patterns in HFT

1. Pre-size containers before the session.
2. Use object pools for long-lived in-flight entities.
3. Use arenas for scratch memory with bulk reset.
4. Touch and pin critical memory during initialization.
5. Track pool exhaustion as an operational alarm, not a surprise crash.

## Interview questions with answers

### 1. Why is `malloc` problematic in low-latency paths?
Because it introduces unpredictable latency from allocator metadata, synchronization, fragmentation behavior, and possible page faults. The average may be fine while the tail is unacceptable.

### 2. When is an arena allocator better than a pool allocator?
When objects share a common lifetime and can be discarded together. An arena is simpler and faster than maintaining a free list for individually freed blocks.

### 3. What does zero-copy mean in practice?
It means avoiding unnecessary data duplication by passing references, views, handles, or ownership of buffers instead of creating new buffers at each stage.

### 4. Why might a per-thread pool be preferable to a global pool?
It reduces contention and cache-line bouncing. In HFT, predictable local ownership is usually worth some memory overhead.

### 5. How do you prevent page faults from hurting live latency?
Pre-allocate and touch memory during startup, keep working sets resident where feasible, and avoid demand allocation in the hot path.
