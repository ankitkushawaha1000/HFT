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
