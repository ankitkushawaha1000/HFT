# HFT Coding Example — Lock Free Queue

Source folder: `examples/hft/03-lock-free-queue`.

## Source Files

### `benchmark.cpp`

```cpp
#include <chrono>
#include <cstdint>
#include <deque>
#include <iostream>
#include <mutex>
#include <thread>
#include <type_traits>

#include "spsc-queue.h"

template <typename T>
class MutexQueue {
public:
    void push(const T& value) {
        std::lock_guard<std::mutex> lock(mutex_);
        queue_.push_back(value);
    }

    bool pop(T& value) {
        std::lock_guard<std::mutex> lock(mutex_);
        if (queue_.empty()) {
            return false;
        }
        value = queue_.front();
        queue_.pop_front();
        return true;
    }

private:
    std::deque<T> queue_;
    std::mutex mutex_;
};

template <typename Queue>
long long benchmarkQueue(const char* label, Queue& queue, int item_count) {
    const auto start = std::chrono::steady_clock::now();

    std::thread producer([&queue, item_count]() {
        for (int i = 0; i < item_count; ++i) {
            while (true) {
                if constexpr (std::is_same<Queue, MutexQueue<std::uint64_t>>::value) {
                    queue.push(static_cast<std::uint64_t>(i));
                    break;
                } else if (queue.push(static_cast<std::uint64_t>(i))) {
                    break;
                } else {
                    std::this_thread::yield();
                }
            }
        }
    });

    std::thread consumer([&queue, item_count]() {
        std::uint64_t value = 0;
        int received = 0;
        while (received < item_count) {
            if (queue.pop(value)) {
                ++received;
            } else {
                std::this_thread::yield();
            }
        }
    });

    producer.join();
    consumer.join();

    const auto end = std::chrono::steady_clock::now();
    const auto elapsed = std::chrono::duration_cast<std::chrono::microseconds>(end - start).count();
    std::cout << label << ": " << elapsed << " us\n";
    return elapsed;
}

int main() {
    constexpr int item_count = 500000;
    SPSCQueue<std::uint64_t, 4096> lock_free_queue;
    MutexQueue<std::uint64_t> mutex_queue;

    benchmarkQueue("SPSC queue", lock_free_queue, item_count);
    benchmarkQueue("Mutex queue", mutex_queue, item_count);
    return 0;
}
```

### `spsc-queue.h`

```cpp
#pragma once

#include <array>
#include <atomic>
#include <cstddef>

template <typename T, std::size_t Capacity>
class SPSCQueue {
    static_assert(Capacity >= 2, "Capacity must be at least 2");

public:
    bool push(const T& value) {
        const std::size_t tail = tail_.load(std::memory_order_relaxed);
        const std::size_t next = increment(tail);
        if (next == head_.load(std::memory_order_acquire)) {
            return false;
        }

        buffer_[tail] = value;
        tail_.store(next, std::memory_order_release);
        return true;
    }

    bool pop(T& value) {
        const std::size_t head = head_.load(std::memory_order_relaxed);
        if (head == tail_.load(std::memory_order_acquire)) {
            return false;
        }

        value = buffer_[head];
        head_.store(increment(head), std::memory_order_release);
        return true;
    }

    bool empty() const {
        return head_.load(std::memory_order_acquire) == tail_.load(std::memory_order_acquire);
    }

private:
    static constexpr std::size_t increment(std::size_t index) {
        return (index + 1) % Capacity;
    }

    alignas(64) std::array<T, Capacity> buffer_{};
    alignas(64) std::atomic<std::size_t> head_{0};
    alignas(64) std::atomic<std::size_t> tail_{0};
};
```

### `test.cpp`

```cpp
#include <cassert>
#include <cstdint>
#include <thread>

#include "spsc-queue.h"

int main() {
    {
        SPSCQueue<int, 8> queue;
        int value = 0;
        assert(queue.empty());
        assert(queue.push(1));
        assert(queue.push(2));
        assert(queue.pop(value) && value == 1);
        assert(queue.pop(value) && value == 2);
        assert(!queue.pop(value));
    }

    {
        constexpr int item_count = 100000;
        SPSCQueue<std::uint64_t, 1024> queue;
        std::uint64_t sum = 0;

        std::thread producer([&queue]() {
            for (int i = 1; i <= item_count; ++i) {
                while (!queue.push(static_cast<std::uint64_t>(i))) {
                    std::this_thread::yield();
                }
            }
        });

        std::thread consumer([&queue, &sum]() {
            int received = 0;
            std::uint64_t value = 0;
            while (received < item_count) {
                if (queue.pop(value)) {
                    sum += value;
                    ++received;
                } else {
                    std::this_thread::yield();
                }
            }
        });

        producer.join();
        consumer.join();

        const std::uint64_t expected =
            static_cast<std::uint64_t>(item_count) * static_cast<std::uint64_t>(item_count + 1) / 2U;
        assert(sum == expected);
    }

    return 0;
}
```
