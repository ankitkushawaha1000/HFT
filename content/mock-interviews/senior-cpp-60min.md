# Senior C++ Technical Interview Simulation (60 Minutes)

**Target candidate:** Senior C++ engineer transitioning from Deutsche Bank to HFT  
**Interview goal:** Test language depth, systems thinking, performance instincts, and the ability to reason aloud under pressure.

---

## Interview structure

- 0:00-5:00 — Intro and calibration
- 5:00-10:00 — Warm-up questions
- 10:00-45:00 — Core technical section
- 45:00-60:00 — Live coding: simple lock-free ring buffer

**Interviewer stance:** collaborative but probing. The interviewer expects concise answers, correct terminology, and clear tradeoff reasoning.

---

## Full interviewer opening script

> Thanks for joining. This will be a technical C++ discussion with one short coding exercise at the end. I’m less interested in memorized definitions and more interested in whether you can reason precisely about behavior, performance, and correctness. If you’re unsure of something, say what you know and what assumptions you’re making. Let’s start with a couple of quick warm-up questions.

---

## Warm-up section (10 minutes)

### Warm-up 1 — Value categories and move semantics

**Prompt**

> Can you explain the difference between lvalues, xvalues, and prvalues, and why that matters for move semantics?

**What a strong answer should cover**

- lvalue: has identity, can generally appear on left-hand side
- prvalue: pure rvalue, temporary value
- xvalue: expiring value with identity, often result of `std::move`
- `std::move` is a cast, not a move by itself
- overload resolution selects move operations when available
- moved-from object must remain valid but with unspecified value

**Good follow-ups**

- Why can `const T&&` be surprising?
- When does copy elision make moves irrelevant?
- Why is `noexcept` important on move constructors?

**Evaluation criteria**

- Terminology accuracy
- Practical understanding, not just standardese
- Ability to connect concept to container behavior

### Warm-up 2 — Smart pointer tradeoffs

**Prompt**

> When is `shared_ptr` the wrong choice in a low-latency code path?

**Strong answer elements**

- refcount overhead, often atomic
- cache coherence traffic and unpredictable destruction point
- control block allocation and locality concerns
- hidden ownership makes lifetime harder to reason about
- often better alternatives: stack/value, `unique_ptr`, arena ownership, raw observer pointers

**Follow-ups**

- When is `shared_ptr` still justified?
- What does `make_shared` optimize?

---

## Core section (35 minutes)

### Core Question 1 — Memory management and custom allocators

**Prompt**

> You have a hot-path component that processes market data bursts. Heap allocations are showing up in profiles and tail latency is unstable. Walk me through how you would redesign memory management.

**Strong answer direction**

- First clarify allocation pattern: object sizes, lifetimes, burstiness, thread ownership, reclamation requirements
- Remove incidental allocations before reaching for custom allocators
- Prefer object reuse, preallocation, slab/pool allocators, arena/monotonic strategies where lifetimes permit
- Consider `std::pmr` for allocator plumbing if appropriate
- Separate cold-path flexibility from hot-path predictability
- Measure fragmentation, locality, cache misses, and reclamation behavior
- Avoid global allocator contention in multi-threaded paths

**Deep-dive follow-ups**

1. What allocator strategy would you choose if objects are fixed-size and short-lived?
2. What changes if objects vary widely in size?
3. How would you avoid returning memory to the OS in the hot path?
4. Where can custom allocators go wrong from a correctness perspective?
5. How would you prove the new design improved p99 latency rather than average latency only?

**High-signal points to mention**

- thread-local pools;
- free lists and ABA concerns if shared concurrently;
- cache-line alignment and false sharing;
- bulk reset of arenas when lifetime domains are clear;
- interaction between allocator design and exception safety / object lifetime.

**Example answer outline**

> I’d start by classifying allocations rather than immediately writing a custom allocator. In bursty market data paths, the key questions are whether objects are fixed-size, whether they can be reused, and whether their lifetime is naturally tied to a batch or snapshot. If yes, I’d strongly prefer preallocation plus reuse, or an arena/pool design, because the primary goal is deterministic allocation cost and better locality. If the interface surface is large, I might use `std::pmr` to pass an allocator/resource through the system without rewriting every type. I would also try to isolate hot-path objects from cold-path convenience allocations so we don’t optimize the wrong thing.  
> **CANDIDATE_TODO:** Add one real example from your experience where you reduced allocation cost or improved locality.

**Evaluation criteria**

- Understands allocator choice as a workload question
- Mentions lifetime domains and measurement
- Avoids magical thinking about “custom allocator = faster”

---

### Core Question 2 — Concurrency and atomics

**Prompt**

> Suppose you are implementing a single-producer, single-consumer queue. How would you think about atomics and memory ordering? What can go wrong if you get it wrong?

**Strong answer direction**

- Identify SPSC simplifies many problems versus MPMC
- Two indices: head and tail, ideally on separate cache lines
- Producer writes element, then publishes new tail with release semantics
- Consumer reads tail with acquire before consuming visible element
- Similar logic for head in reverse direction
- Relaxed ordering may be safe for thread-local index updates in some parts, but publication edges matter
- Discuss false sharing, wrapping arithmetic, full vs empty ambiguity, and capacity reservation

**Deep-dive follow-ups**

1. Why is `volatile` not sufficient?
2. When could `memory_order_relaxed` be used safely?
3. How would this change for MPMC?
4. What is false sharing and how would you prevent it here?
5. How would you test for correctness beyond “it seems to work on my machine”?

**High-signal points to mention**

- acquire/release establishes visibility relation;
- x86 is strong, but code should target the C++ memory model, not folklore;
- under-specifying order can create stale reads or torn reasoning even if it passes local tests;
- performance work comes after correctness model is clear.

**Example answer outline**

> In SPSC, I’d keep the model simple: one thread owns each side’s local progress, and atomics are primarily used for publication between threads. The producer should fully write the element before making the new tail visible with a release store. The consumer should acquire the tail before reading that slot so it knows the element contents are visible. I’d pad the indices to avoid false sharing, and I’d decide explicitly how to represent full versus empty so I don’t introduce an off-by-one correctness bug.  
> **CANDIDATE_TODO:** Add a real concurrency bug, profiling issue, or queue implementation detail you have seen before.

**Evaluation criteria**

- Can reason at memory-model level
- Distinguishes correctness from micro-optimization
- Knows common pitfalls in lock-free structures

---

### Core Question 3 — Template metaprogramming and compile-time constraints

**Prompt**

> Imagine you are building a generic feed-decoding utility. Some message types expose `decode(const std::byte*, size_t)`, others expose `decode(span<const std::byte>)`. How would you design a template interface that accepts only compatible decoders and produces readable compile-time errors?

**Strong answer direction**

- Prefer concepts or `requires` over legacy `enable_if` where possible
- Define a concept for decoder compatibility
- Consider normalization wrapper/adaptor if interfaces differ slightly
- Use `if constexpr` only after constraints are clear
- Keep diagnostics readable and avoid over-templating hot code paths unnecessarily

**Deep-dive follow-ups**

1. When is a concept better than tag dispatch?
2. How would you write this in pre-C++20 code?
3. What are the compile-time cost tradeoffs of heavy template machinery?
4. When should you prefer runtime polymorphism instead?

**Example concept sketch**

```cpp
template <typename D>
concept PointerDecoder = requires(D d, const std::byte* p, std::size_t n) {
    { d.decode(p, n) } -> std::same_as<void>;
};

template <typename D>
concept SpanDecoder = requires(D d, std::span<const std::byte> s) {
    { d.decode(s) } -> std::same_as<void>;
};
```

**Example answer outline**

> I’d start by defining the interface I actually want callers to rely on, then constrain implementations to match it cleanly. In modern C++, concepts are the best tool because they make the requirement explicit and the diagnostics much more understandable. If I want to support both pointer-length and span-based decoders, I’d likely normalize them behind a small adapter layer so the rest of the pipeline is not riddled with conditional template branches.  
> **CANDIDATE_TODO:** Add any relevant example involving concepts, type traits, or generic utilities from your experience.

**Evaluation criteria**

- Understands why concepts improve code quality
- Balances genericity with simplicity
- Can discuss compile-time cost and maintainability

---

## Live coding challenge (15 minutes)

### Prompt

> Implement a simple fixed-capacity single-producer, single-consumer ring buffer for `int`. It should support `bool push(int)` and `bool pop(int&)`. Use atomics for indices and assume one producer thread and one consumer thread. You do not need dynamic resizing, exceptions, or allocators. Talk through your decisions as you code.

### What the interviewer expects

- Clean representation of storage and indices
- Correct full/empty handling
- Sensible use of atomics and memory ordering
- Awareness of wraparound and capacity choice
- Ability to explain tradeoffs while coding

### Strong implementation characteristics

- `std::vector<int>` or fixed array storage allocated up front
- head and tail indices as atomics
- release store on publish, acquire load on consume
- optional padding/alignment discussion
- avoids undefined behavior and data races

### Common mistakes

- Using non-atomic shared indices
- Publishing the index before the data write is complete
- Confusing modulo arithmetic and full/empty state
- Using `volatile` instead of atomics
- Getting trapped in unnecessary abstraction

### Useful interviewer follow-ups

- How would you extend this to store non-trivial types?
- Would you waste one slot or track size separately?
- How would you benchmark it?
- What changes for MPSC or MPMC?

---

## Overall evaluation rubric

| Area | Weak | Competent | Strong |
|---|---|---|---|
| Language fundamentals | Fragmented knowledge | Correct on common cases | Precise and confident |
| Performance instincts | Talks vaguely about “fast” | Mentions common optimizations | Reasons from allocation, locality, and contention |
| Concurrency reasoning | Memorized terms only | Knows atomics basics | Correct acquire/release reasoning and pitfalls |
| Generic programming | Avoids templates or overcomplicates | Can use standard tools | Uses concepts/constraints thoughtfully |
| Coding | Compiles in spirit but shaky | Mostly correct | Clean, correct, and well-explained |
| Communication | Silent or rambling | Explains some decisions | Thinks aloud clearly and methodically |

---

## Self-assessment questions

1. Did I answer from first principles, or from memorized slogans?
2. Did I mention measurement when discussing performance?
3. Did I clearly distinguish allocator strategy, ownership, and object lifetime?
4. Could I explain my memory ordering choices without hand-waving?
5. Did I keep the coding solution simple enough for 15 minutes?

## Practice standard

You are ready for a live senior C++ round when you can:

- explain one allocator strategy in workload terms;
- reason through SPSC atomics without guessing;
- write a simple ring buffer from memory in 15 minutes;
- discuss template constraints without disappearing into metaprogramming theater.
