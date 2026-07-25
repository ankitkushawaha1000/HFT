#include <chrono>
#include <iostream>
#include <utility>
#include <vector>

struct Payload {
    explicit Payload(std::size_t size) : values(size, 7) {}
    std::vector<int> values;
};

int main() {
    constexpr std::size_t element_count = 1U << 20U;
    constexpr int iterations = 200;

    Payload source(element_count);
    std::size_t checksum = 0;

    const auto copy_start = std::chrono::steady_clock::now();
    for (int i = 0; i < iterations; ++i) {
        Payload copied = source;
        checksum += copied.values.size();
    }
    const auto copy_end = std::chrono::steady_clock::now();

    const auto move_start = std::chrono::steady_clock::now();
    for (int i = 0; i < iterations; ++i) {
        Payload fresh(element_count);
        Payload moved = std::move(fresh);
        checksum += moved.values.size();
    }
    const auto move_end = std::chrono::steady_clock::now();

    const auto copy_us = std::chrono::duration_cast<std::chrono::microseconds>(copy_end - copy_start);
    const auto move_us = std::chrono::duration_cast<std::chrono::microseconds>(move_end - move_start);

    std::cout << "Copy benchmark: " << copy_us.count() << " us\n";
    std::cout << "Move benchmark: " << move_us.count() << " us\n";
    std::cout << "Checksum: " << checksum << '\n';

    return 0;
}
