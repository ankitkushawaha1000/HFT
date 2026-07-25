#include <cassert>

#include "order-book.h"

int main() {
    OrderBook book;

    book.addOrder(1, OrderBook::Side::Bid, 100, 10, 1);
    book.addOrder(2, OrderBook::Side::Bid, 101, 5, 2);
    book.addOrder(3, OrderBook::Side::Ask, 105, 7, 3);

    const auto best_bid = book.getBestBid();
    const auto best_ask = book.getBestAsk();
    assert(best_bid.has_value());
    assert(best_bid->price_ticks == 101);
    assert(best_bid->total_quantity == 5);
    assert(best_ask.has_value());
    assert(best_ask->price_ticks == 105);

    assert(book.cancelOrder(1));
    assert(!book.cancelOrder(999));

    book.addOrder(4, OrderBook::Side::Ask, 103, 50, 4);
    book.addOrder(5, OrderBook::Side::Bid, 104, 30, 5);
    auto ask_after_partial = book.getBestAsk();
    assert(ask_after_partial.has_value());
    assert(ask_after_partial->price_ticks == 103);
    assert(ask_after_partial->total_quantity == 20);

    book.addOrder(6, OrderBook::Side::Bid, 103, 20, 6);
    ask_after_partial = book.getBestAsk();
    assert(ask_after_partial.has_value());
    assert(ask_after_partial->price_ticks == 105);

    const auto depth = book.getDepth(2);
    assert(depth.bids.size() <= 2);
    assert(depth.asks.size() <= 2);

    return 0;
}
