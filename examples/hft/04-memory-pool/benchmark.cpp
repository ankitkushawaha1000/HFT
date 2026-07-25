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
