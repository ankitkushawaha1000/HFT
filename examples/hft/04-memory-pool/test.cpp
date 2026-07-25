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
