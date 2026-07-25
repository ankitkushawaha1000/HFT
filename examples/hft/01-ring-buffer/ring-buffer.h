#pragma once

#include <array>
#include <cstddef>
#include <type_traits>

template <typename T, std::size_t Capacity>
class RingBuffer {
    static_assert(Capacity > 0, "Capacity must be positive");
    static_assert(std::is_trivially_copyable<T>::value,
                  "This simple ring buffer is intended for POD-like types");

public:
    bool push(const T& value) {
        if (full()) {
            return false;
        }

        buffer_[tail_] = value;
        tail_ = (tail_ + 1) % Capacity;
        ++size_;
        return true;
    }

    bool pop(T& value) {
        if (empty()) {
            return false;
        }

        value = buffer_[head_];
        head_ = (head_ + 1) % Capacity;
        --size_;
        return true;
    }

    bool empty() const {
        return size_ == 0;
    }

    bool full() const {
        return size_ == Capacity;
    }

    std::size_t size() const {
        return size_;
    }

private:
    std::array<T, Capacity> buffer_{};
    std::size_t head_ = 0;
    std::size_t tail_ = 0;
    std::size_t size_ = 0;
};
