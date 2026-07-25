#pragma once

#include <cstdint>
#include <list>

struct Order {
    std::uint64_t id = 0;
    std::uint64_t quantity = 0;
    std::uint64_t timestamp = 0;
};

struct PriceLevel {
    std::int64_t price_ticks = 0;
    std::uint64_t total_quantity = 0;
    std::list<Order> orders;
};
