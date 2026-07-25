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
