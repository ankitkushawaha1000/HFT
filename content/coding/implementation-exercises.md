# Practical C++ Implementation Exercises

Research date: 2026-07-24

These exercises are representative of the implementation-heavy questions that appear in HFT interviews. The goal is not always to finish every line of production-grade code during the interview; it is to demonstrate strong decomposition, correctness, and performance awareness.

## Exercise 1: Implement a simple ring buffer (SPSC queue)

### Problem statement

Implement a bounded single-producer single-consumer queue using a ring buffer. Support `push`, `pop`, `empty`, and `full`. Avoid dynamic allocation during steady-state operation.

### Hints

- use a power-of-two capacity
- store head and tail indices separately
- define empty and full conditions carefully
- for a concurrent version, think about acquire/release ordering

### Solution outline

```cpp
template <typename T, std::size_t Capacity>
class SpscRing {
public:
    bool push(const T& v);
    bool pop(T& out);
private:
    std::array<T, Capacity> buf_{};
    std::size_t head_{0};
    std::size_t tail_{0};
};
```

In the single-threaded explanation phase, the key insight is wraparound indexing and using either one empty slot or monotonic counters to distinguish full from empty.

### Complexity

O(1) push and O(1) pop, O(Capacity) memory.

## Exercise 2: Implement an LRU cache

### Problem statement

Design an LRU cache with O(1) average `get` and `put`.

### Hints

- combine a hash map with a doubly linked list
- move accessed nodes to the front
- evict from the back when capacity is exceeded

### Solution outline

Use `std::list<std::pair<Key, Value>>` and an `unordered_map<Key, list::iterator>`. A senior-level discussion should mention iterator stability of `std::list` and the memory/cache tradeoff versus more compact custom designs.

### Complexity

Expected O(1) get and put, O(capacity) memory.

## Exercise 3: Thread-safe queue (mutex-based)

### Problem statement

Implement a multi-producer multi-consumer queue with `push`, blocking `pop`, and shutdown support.

### Hints

- use `std::mutex` and `std::condition_variable`
- guard against spurious wakeups with a predicate loop
- define behavior after shutdown explicitly

### Solution outline

```cpp
template <typename T>
class BlockingQueue {
public:
    void push(T value) {
        {
            std::lock_guard<std::mutex> lock(mu_);
            q_.push(std::move(value));
        }
        cv_.notify_one();
    }

    bool pop(T& out) {
        std::unique_lock<std::mutex> lock(mu_);
        cv_.wait(lock, [&]{ return closed_ || !q_.empty(); });
        if (q_.empty()) return false;
        out = std::move(q_.front());
        q_.pop();
        return true;
    }

    void close() {
        {
            std::lock_guard<std::mutex> lock(mu_);
            closed_ = true;
        }
        cv_.notify_all();
    }
private:
    std::mutex mu_;
    std::condition_variable cv_;
    std::queue<T> q_;
    bool closed_{false};
};
```

A mature answer states that mutex-based is often preferable unless strict low-latency requirements force lock-free alternatives.

### Complexity

O(1) average per operation excluding scheduling delay.

## Exercise 4: Order book simulation

### Problem statement

Implement add, cancel, and match for a simplified limit order book with price-time priority.

### Hints

- represent prices as integer ticks
- maintain per-price FIFO queues
- keep a direct order-ID lookup table
- define partial-fill semantics clearly

### Solution outline

Suggested design:

- `unordered_map<OrderId, Order*>` for direct lookup
- ordered buy and sell price structures
- intrusive or linked queue per level
- matching loop that consumes best opposite prices while marketable

### Complexity

Depends on level structure: O(1) or O(log N) level lookup plus O(number of fills) matching work.

## Exercise 5: Rate limiter implementation

### Problem statement

Implement a rate limiter supporting `allow()` for N events per time window.

### Hints

- clarify whether fixed window, sliding window, or token bucket is desired
- token bucket is often the best general answer for trading gateways
- consider monotonic clocks and thread safety

### Solution outline

For a token bucket, store current tokens, refill rate, last update time, and capacity. On each `allow()`, refill based on elapsed time, then approve if tokens remain.

### Complexity

O(1) time and O(1) space.

## How interviewers evaluate these exercises

They look for:

- correct invariants
- sensible decomposition
- appropriate container choices
- awareness of edge cases and shutdown semantics
- performance reasoning that matches the problem rather than overcomplicates it

If you cannot finish every function, leave a clearly structured skeleton and explain the remaining invariant-preserving steps. That is much better than chaotic half-code.

## What interviewers ask next

After a baseline implementation, interviewers often extend the exercise. For the ring buffer, they may ask about concurrency and memory ordering. For the LRU cache, they may ask about thread safety or TTL expiry. For the blocking queue, they may ask about bounded capacity and backpressure. For the order book, they may ask about partial fills, top-of-book queries, or modify semantics. For the rate limiter, they may ask about distributed coordination or token refill precision.

## Testing checklist for implementation exercises

For each problem, explicitly test normal behavior, empty/full boundaries, duplicate operations, and shutdown or invalid-input semantics where relevant. This is especially important for queues and order-book exercises, where off-by-one and race-adjacent logic bugs are common.

## Production-minded follow-ups

A senior candidate can earn extra credit by mentioning what would change in production: custom allocators for hot objects, metrics and logging hooks, API invariants, fuzz or property testing for state machines, and clear ownership documentation. The point is not to overbuild during the interview, but to show awareness of what robust code requires.
