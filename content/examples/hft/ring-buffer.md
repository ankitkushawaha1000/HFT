# HFT Coding Example — Ring Buffer

Source folder: `examples/hft/01-ring-buffer`.

## Notes

# Ring Buffer

This example implements a fixed-capacity ring buffer for trivially copyable types. Push and pop are both `O(1)` and use simple index arithmetic, which is why ring buffers are common in HFT hot paths.

Typical HFT uses include staging market data events, recycling packet descriptors, and building SPSC queues. The design here is intentionally non-thread-safe so the data structure stays easy to reason about before moving on to lock-free variants.


## Source Files

### `benchmark.cpp`

```cpp
#include <chrono>
#include <cstdint>
#include <iostream>

#include "ring-buffer.h"

int main() {
    RingBuffer<std::uint64_t, 1024> buffer;
    constexpr std::size_t iterations = 5'000'000;
    std::uint64_t value = 0;
    std::uint64_t checksum = 0;

    const auto start = std::chrono::steady_clock::now();
    for (std::size_t i = 0; i < iterations; ++i) {
        while (!buffer.push(static_cast<std::uint64_t>(i))) {
            const bool popped = buffer.pop(value);
            if (popped) {
                checksum += value;
            }
        }
    }

    while (buffer.pop(value)) {
        checksum += value;
    }

    const auto end = std::chrono::steady_clock::now();
    const auto elapsed = std::chrono::duration_cast<std::chrono::microseconds>(end - start);

    std::cout << "Ring buffer push/pop time: " << elapsed.count() << " us\n";
    std::cout << "Checksum: " << checksum << '\n';
    return 0;
}
```

### `ring-buffer.h`

```cpp
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
```

### `test.cpp`

```cpp
#include <cassert>
#include <cstdint>

#include "ring-buffer.h"

int main() {
    RingBuffer<std::uint32_t, 4> buffer;
    std::uint32_t value = 0;

    assert(buffer.empty());
    assert(buffer.push(1));
    assert(buffer.push(2));
    assert(buffer.push(3));
    assert(buffer.push(4));
    assert(buffer.full());
    assert(!buffer.push(5));

    assert(buffer.pop(value) && value == 1);
    assert(buffer.pop(value) && value == 2);
    assert(buffer.size() == 2);

    assert(buffer.push(5));
    assert(buffer.push(6));
    assert(buffer.full());

    assert(buffer.pop(value) && value == 3);
    assert(buffer.pop(value) && value == 4);
    assert(buffer.pop(value) && value == 5);
    assert(buffer.pop(value) && value == 6);
    assert(buffer.empty());
    assert(!buffer.pop(value));

    return 0;
}
```
