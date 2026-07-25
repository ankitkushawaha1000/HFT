#include <chrono>
#include <cstdint>
#include <iostream>

#include "order-book.h"

int main() {
    OrderBook book;
    constexpr std::uint64_t operation_count = 1'000'000;

    const auto start = std::chrono::steady_clock::now();
    for (std::uint64_t i = 0; i < operation_count / 2; ++i) {
        book.addOrder(i + 1, OrderBook::Side::Bid, 100 + static_cast<std::int64_t>(i % 32), 10, i);
    }
    for (std::uint64_t i = 0; i < operation_count / 2; ++i) {
        const bool cancelled = book.cancelOrder(i + 1);
        if (!cancelled) {
            return 1;
        }
    }
    const auto end = std::chrono::steady_clock::now();

    const auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
    std::cout << "Processed " << operation_count << " add/cancel operations in "
              << elapsed.count() << " ms\n";
    return 0;
}
