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
