# Lock-Free Queues in Low-Latency Systems

Research date: 2026-07-24

Lock-free queues are a staple of HFT system design because they enable thread-to-thread handoff without kernel blocking and often with far less jitter than general-purpose mutex-protected queues. But they are also one of the easiest places to introduce subtle correctness bugs. Senior engineers are expected to understand not just how to use a queue, but why a particular concurrency model is appropriate and what memory-order guarantees it needs.

## SPSC ring buffer design

The simplest and most practical lock-free queue in HFT is the single-producer single-consumer ring buffer. One thread owns writes to the tail, and one thread owns reads from the head. Because each index has a single writer, contention is dramatically reduced and the algorithm can avoid compare-and-swap loops.

A typical SPSC ring buffer uses:

- fixed capacity, usually a power of two
- a contiguous array of slots
- `head` owned by the consumer
- `tail` owned by the producer
- index masking instead of modulo when capacity is a power of two

The producer checks whether `tail - head < capacity` before writing. The consumer checks whether `tail != head` before reading. The queue is usually bounded because boundedness avoids allocation and makes worst-case memory use explicit.

## Why acquire/release is sufficient for SPSC

In SPSC, each side updates only its own cursor, so the main requirement is publication ordering. The producer must ensure that the element contents become visible before publishing the new tail. The consumer must ensure that it sees the published tail before reading the element.

That is why `memory_order_release` on the producer store to `tail` and `memory_order_acquire` on the consumer load of `tail` are typically sufficient. Similarly, the consumer can release the updated `head`, and the producer can acquire it when checking for free space.

A full sequentially consistent ordering is correct but usually unnecessary and slower on some architectures. Relaxed operations can be used for thread-local loads of the cursor a thread owns, but using relaxed everywhere is a common interview red flag because it ignores visibility requirements.

## Practical C++ outline for SPSC

```cpp
#include <array>
#include <atomic>
#include <cstddef>
#include <optional>

template <typename T, std::size_t Capacity>
class SpscQueue {
    static_assert((Capacity & (Capacity - 1)) == 0, "Capacity must be power of two");

public:
    bool push(const T& value) {
        const auto tail = tail_.load(std::memory_order_relaxed);
        const auto next = tail + 1;
        if (next - head_.load(std::memory_order_acquire) > Capacity) {
            return false;
        }
        buffer_[tail & (Capacity - 1)] = value;
        tail_.store(next, std::memory_order_release);
        return true;
    }

    std::optional<T> pop() {
        const auto head = head_.load(std::memory_order_relaxed);
        if (head == tail_.load(std::memory_order_acquire)) {
            return std::nullopt;
        }
        T value = buffer_[head & (Capacity - 1)];
        head_.store(head + 1, std::memory_order_release);
        return value;
    }

private:
    alignas(64) std::array<T, Capacity> buffer_{};
    alignas(64) std::atomic<std::size_t> head_{0};
    alignas(64) std::atomic<std::size_t> tail_{0};
};
```

This outline is intentionally simple. In production, you may avoid `std::optional` in the hot path, construct in place, and support move semantics or trivially copyable constraints.

## Cache-line alignment for head and tail

False sharing can destroy the performance benefit of a lock-free design. If `head` and `tail` live on the same cache line, producer and consumer invalidate each other’s caches even though they write different variables. Aligning and padding them to separate cache lines is standard practice.

The same principle applies to queue slots if multiple fields within a slot are written by different actors. Ownership boundaries should be reflected in memory layout.

## MPMC complexity

Multi-producer multi-consumer queues are much harder. Now multiple threads race to claim enqueue and dequeue positions, and correctness often requires compare-and-swap loops, per-slot sequencing, or tickets. Contention grows quickly, and throughput may look good while tail latency deteriorates due to repeated retries.

Common MPMC challenges include:

- ABA problems on reused nodes or pointers
- fairness versus throughput tradeoffs
- harder reasoning about backpressure
- more cache contention on shared indices
- more expensive memory ordering requirements

Many HFT systems avoid MPMC on the hot path by restructuring ownership: shard work by symbol, dedicate one thread per partition, or use a staged pipeline of SPSC links.

## Sequence number technique

A robust approach for bounded MPMC ring buffers is to associate a sequence number with each slot. Producers check whether a slot’s sequence indicates it is free for the current enqueue position; consumers check whether the slot is ready for the current dequeue position. This avoids a single “full/empty” ambiguity and helps coordinate slot reuse correctly.

Sequence numbering also generalizes well to fixed-capacity queues because each slot cycles through states as positions advance. The tradeoff is extra per-slot metadata and more intricate correctness reasoning.

## The ABA problem

ABA occurs when a thread reads a pointer value A, another thread changes it to B and back to A, and the first thread incorrectly concludes that nothing changed. In lock-free stacks or linked queues, this can produce use-after-free or corrupted structure updates.

Typical solutions:

- **Tagged pointers or version counters:** treat A-with-version-1 and A-with-version-2 as different values.
- **Hazard pointers:** prevent reclamation while another thread may still observe a node.
- **Epoch-based reclamation / RCU-like schemes:** defer reuse until it is safe.
- **Avoid node reuse on the critical path:** bounded ring buffers sidestep many reclamation issues.

Interviewers care less about memorizing names than about understanding that correctness in lock-free code is as much about memory reclamation as atomic updates.

## Lock-free is not wait-free

A lock-free algorithm guarantees system-wide progress: some thread completes in a finite number of steps. It does **not** guarantee that every thread completes quickly. Under contention, one unlucky thread can spin or repeatedly lose CAS races for a long time.

Wait-free is stronger: every operation completes in a bounded number of steps. Many practical high-performance structures are lock-free but not wait-free because true wait-freedom is harder and may have worse constant factors.

## Design guidance in HFT

- Prefer SPSC whenever the topology allows it.
- Use bounded queues to eliminate allocation and simplify memory ownership.
- Model backpressure explicitly; a fast queue does not eliminate overload.
- Align indices and hot metadata to cache lines.
- Treat reclamation as a first-class design problem in pointer-based lock-free structures.

## Interview questions with answers

### 1. Why is SPSC much simpler than MPMC?
Because each cursor has a single writer. That removes CAS contention on shared indices and makes acquire/release publication enough for most implementations.

### 2. Why are acquire/release semantics enough for an SPSC ring buffer?
The producer only needs to publish element contents before publishing the new tail, and the consumer only needs to observe that publication before reading the element. Acquire/release expresses exactly that visibility relationship.

### 3. What is the ABA problem?
A compare-and-swap can be fooled when a pointer changes from A to B and back to A, hiding the fact that the underlying object changed or was reused. Version tags, hazard pointers, and epochs are standard mitigations.

### 4. Why does false sharing matter in queues?
If producer and consumer write different variables on the same cache line, the cache line bounces between cores, adding latency and jitter despite there being no logical contention.

### 5. Why might an HFT system avoid MPMC even if it is theoretically more flexible?
Because flexibility is not free. MPMC adds contention, retries, complex reclamation, and more variable tails. A pipeline of SPSC queues or per-symbol ownership is often easier to reason about and faster in practice.
