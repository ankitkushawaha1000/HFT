# HFT Coding Example — Memory Pool

Source folder: `examples/hft/04-memory-pool`.

## Source Files

### `benchmark.cpp`

```cpp
#include <chrono>
#include <iostream>
#include <new>
#include <vector>

#include "pool.h"

struct OrderStub {
    int id;
    int quantity;
    char padding[32];
};

int main() {
    constexpr std::size_t batch_size = 1024;
    constexpr int batches = 5000;

    MemoryPool<sizeof(OrderStub), batch_size> pool;
    std::vector<void*> slots;
    slots.reserve(batch_size);

    const auto pool_start = std::chrono::steady_clock::now();
    for (int batch = 0; batch < batches; ++batch) {
        slots.clear();
        for (std::size_t i = 0; i < batch_size; ++i) {
            void* raw = pool.allocate();
            auto* object = new (raw) OrderStub{static_cast<int>(i), batch, {}};
            slots.push_back(object);
        }
        for (void* raw : slots) {
            auto* object = static_cast<OrderStub*>(raw);
            object->~OrderStub();
            pool.deallocate(raw);
        }
    }
    const auto pool_end = std::chrono::steady_clock::now();

    const auto heap_start = std::chrono::steady_clock::now();
    for (int batch = 0; batch < batches; ++batch) {
        std::vector<OrderStub*> heap_objects;
        heap_objects.reserve(batch_size);
        for (std::size_t i = 0; i < batch_size; ++i) {
            heap_objects.push_back(new OrderStub{static_cast<int>(i), batch, {}});
        }
        for (OrderStub* object : heap_objects) {
            delete object;
        }
    }
    const auto heap_end = std::chrono::steady_clock::now();

    const auto pool_us = std::chrono::duration_cast<std::chrono::microseconds>(pool_end - pool_start);
    const auto heap_us = std::chrono::duration_cast<std::chrono::microseconds>(heap_end - heap_start);

    std::cout << "Memory pool: " << pool_us.count() << " us\n";
    std::cout << "new/delete: " << heap_us.count() << " us\n";
    return 0;
}
```

### `pool.h`

```cpp
#pragma once

#include <array>
#include <cstddef>
#include <cstdint>
#include <new>
#include <stdexcept>
#include <type_traits>

template <std::size_t BlockSize, std::size_t PoolCapacity>
class MemoryPool {
    static_assert(BlockSize > 0, "BlockSize must be positive");
    static_assert(PoolCapacity > 0, "PoolCapacity must be positive");

    using Storage = typename std::aligned_storage<BlockSize, alignof(std::max_align_t)>::type;

public:
    MemoryPool() : free_count_(PoolCapacity) {
        for (std::size_t i = 0; i < PoolCapacity; ++i) {
            free_list_[i] = PoolCapacity - 1 - i;
        }
    }

    void* allocate() {
        if (free_count_ == 0) {
            return nullptr;
        }

        const std::size_t index = free_list_[--free_count_];
        return &storage_[index];
    }

    void deallocate(void* pointer) {
        if (pointer == nullptr) {
            return;
        }

        const auto base = reinterpret_cast<std::uintptr_t>(&storage_[0]);
        const auto end = reinterpret_cast<std::uintptr_t>(&storage_[PoolCapacity]);
        const auto value = reinterpret_cast<std::uintptr_t>(pointer);
        if (value < base || value >= end) {
            throw std::invalid_argument("pointer does not belong to this pool");
        }

        const auto offset = value - base;
        if (offset % sizeof(Storage) != 0U) {
            throw std::invalid_argument("pointer is not aligned to a pool block");
        }

        const std::size_t index = offset / sizeof(Storage);
        free_list_[free_count_++] = index;
    }

    std::size_t available() const {
        return free_count_;
    }

    constexpr std::size_t capacity() const {
        return PoolCapacity;
    }

private:
    std::array<Storage, PoolCapacity> storage_{};
    std::array<std::size_t, PoolCapacity> free_list_{};
    std::size_t free_count_;
};
```

### `test.cpp`

```cpp
#include <cassert>
#include <new>

#include "pool.h"

struct OrderNode {
    int id;
    int quantity;
};

int main() {
    MemoryPool<sizeof(OrderNode), 2> pool;

    void* first_raw = pool.allocate();
    void* second_raw = pool.allocate();
    assert(first_raw != nullptr);
    assert(second_raw != nullptr);
    assert(pool.allocate() == nullptr);

    auto* first = new (first_raw) OrderNode{1, 10};
    auto* second = new (second_raw) OrderNode{2, 20};
    assert(first->id == 1);
    assert(second->quantity == 20);

    first->~OrderNode();
    pool.deallocate(first_raw);
    assert(pool.available() == 1);

    void* reused_raw = pool.allocate();
    assert(reused_raw == first_raw);
    auto* reused = new (reused_raw) OrderNode{3, 30};
    assert(reused->id == 3);

    reused->~OrderNode();
    second->~OrderNode();
    pool.deallocate(reused_raw);
    pool.deallocate(second_raw);
    assert(pool.available() == pool.capacity());

    return 0;
}
```
