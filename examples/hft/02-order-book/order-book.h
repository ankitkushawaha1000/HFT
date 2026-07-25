#pragma once

#include <algorithm>
#include <cstdint>
#include <functional>
#include <list>
#include <map>
#include <optional>
#include <stdexcept>
#include <unordered_map>
#include <vector>

#include "price-level.h"

class OrderBook {
public:
    enum class Side { Bid, Ask };

    struct DepthSnapshot {
        std::vector<PriceLevel> bids;
        std::vector<PriceLevel> asks;
    };

    void addOrder(std::uint64_t id,
                  Side side,
                  std::int64_t price_ticks,
                  std::uint64_t quantity,
                  std::uint64_t timestamp) {
        if (quantity == 0) {
            return;
        }
        if (order_index_.count(id) != 0) {
            throw std::invalid_argument("duplicate order id");
        }

        std::uint64_t remaining = quantity;
        if (side == Side::Bid) {
            matchAgainstAsks(remaining, price_ticks);
        } else {
            matchAgainstBids(remaining, price_ticks);
        }

        if (remaining > 0) {
            addRestingOrder(id, side, price_ticks, remaining, timestamp);
        }
    }

    bool cancelOrder(std::uint64_t id) {
        const auto found = order_index_.find(id);
        if (found == order_index_.end()) {
            return false;
        }

        const OrderLocation location = found->second;
        if (location.side == Side::Bid) {
            auto level_it = bids_.find(location.price_ticks);
            if (level_it != bids_.end()) {
                level_it->second.total_quantity -= location.iterator->quantity;
                level_it->second.orders.erase(location.iterator);
                if (level_it->second.orders.empty()) {
                    bids_.erase(level_it);
                }
            }
        } else {
            auto level_it = asks_.find(location.price_ticks);
            if (level_it != asks_.end()) {
                level_it->second.total_quantity -= location.iterator->quantity;
                level_it->second.orders.erase(location.iterator);
                if (level_it->second.orders.empty()) {
                    asks_.erase(level_it);
                }
            }
        }

        order_index_.erase(found);
        return true;
    }

    std::optional<PriceLevel> getBestBid() const {
        if (bids_.empty()) {
            return std::nullopt;
        }
        return bids_.begin()->second;
    }

    std::optional<PriceLevel> getBestAsk() const {
        if (asks_.empty()) {
            return std::nullopt;
        }
        return asks_.begin()->second;
    }

    DepthSnapshot getDepth(std::size_t levels) const {
        DepthSnapshot snapshot;

        std::size_t count = 0;
        for (const auto& entry : bids_) {
            if (count++ == levels) {
                break;
            }
            snapshot.bids.push_back(entry.second);
        }

        count = 0;
        for (const auto& entry : asks_) {
            if (count++ == levels) {
                break;
            }
            snapshot.asks.push_back(entry.second);
        }

        return snapshot;
    }

    bool hasOrder(std::uint64_t id) const {
        return order_index_.count(id) != 0;
    }

private:
    using BidBook = std::map<std::int64_t, PriceLevel, std::greater<>>;
    using AskBook = std::map<std::int64_t, PriceLevel, std::less<>>;

    struct OrderLocation {
        Side side;
        std::int64_t price_ticks;
        std::list<Order>::iterator iterator;
    };

    void addRestingOrder(std::uint64_t id,
                         Side side,
                         std::int64_t price_ticks,
                         std::uint64_t quantity,
                         std::uint64_t timestamp) {
        if (side == Side::Bid) {
            auto& level = bids_[price_ticks];
            level.price_ticks = price_ticks;
            level.total_quantity += quantity;
            level.orders.push_back(Order{id, quantity, timestamp});
            auto order_it = std::prev(level.orders.end());
            order_index_.emplace(id, OrderLocation{side, price_ticks, order_it});
        } else {
            auto& level = asks_[price_ticks];
            level.price_ticks = price_ticks;
            level.total_quantity += quantity;
            level.orders.push_back(Order{id, quantity, timestamp});
            auto order_it = std::prev(level.orders.end());
            order_index_.emplace(id, OrderLocation{side, price_ticks, order_it});
        }
    }

    void matchAgainstAsks(std::uint64_t& remaining, std::int64_t limit_price) {
        auto level_it = asks_.begin();
        while (remaining > 0 && level_it != asks_.end() && level_it->first <= limit_price) {
            auto& level = level_it->second;
            while (remaining > 0 && !level.orders.empty()) {
                auto order_it = level.orders.begin();
                const std::uint64_t traded = std::min(remaining, order_it->quantity);
                remaining -= traded;
                order_it->quantity -= traded;
                level.total_quantity -= traded;

                if (order_it->quantity == 0) {
                    order_index_.erase(order_it->id);
                    level.orders.erase(order_it);
                }
            }

            if (level.orders.empty()) {
                level_it = asks_.erase(level_it);
            } else {
                ++level_it;
            }
        }
    }

    void matchAgainstBids(std::uint64_t& remaining, std::int64_t limit_price) {
        auto level_it = bids_.begin();
        while (remaining > 0 && level_it != bids_.end() && level_it->first >= limit_price) {
            auto& level = level_it->second;
            while (remaining > 0 && !level.orders.empty()) {
                auto order_it = level.orders.begin();
                const std::uint64_t traded = std::min(remaining, order_it->quantity);
                remaining -= traded;
                order_it->quantity -= traded;
                level.total_quantity -= traded;

                if (order_it->quantity == 0) {
                    order_index_.erase(order_it->id);
                    level.orders.erase(order_it);
                }
            }

            if (level.orders.empty()) {
                level_it = bids_.erase(level_it);
            } else {
                ++level_it;
            }
        }
    }

    BidBook bids_;
    AskBook asks_;
    std::unordered_map<std::uint64_t, OrderLocation> order_index_;
};
