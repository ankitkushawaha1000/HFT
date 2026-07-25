#include <cassert>
#include <iostream>
#include <memory>
#include <string>
#include <utility>
#include <vector>

struct LargeBuffer {
    explicit LargeBuffer(std::size_t size = 0) : data(size, 1) {}

    LargeBuffer(const LargeBuffer& other) : data(other.data) {
        ++copies;
    }

    LargeBuffer(LargeBuffer&& other) noexcept : data(std::move(other.data)) {
        ++moves;
    }

    LargeBuffer& operator=(const LargeBuffer& other) {
        if (this != &other) {
            data = other.data;
            ++copies;
        }
        return *this;
    }

    LargeBuffer& operator=(LargeBuffer&& other) noexcept {
        if (this != &other) {
            data = std::move(other.data);
            ++moves;
        }
        return *this;
    }

    static void resetCounters() {
        copies = 0;
        moves = 0;
    }

    static inline int copies = 0;
    static inline int moves = 0;
    std::vector<int> data;
};

struct Ticket {
    Ticket(std::string symbol, int quantity)
        : symbol(std::move(symbol)), quantity(quantity) {}

    std::string symbol;
    int quantity;
};

LargeBuffer makeBuffer() {
    LargeBuffer buffer(1024);
    return buffer; // Copy elision / RVO usually constructs directly in the caller.
}

template <typename T, typename... Args>
std::unique_ptr<T> makeForwarded(Args&&... args) {
    // std::forward preserves lvalues and rvalues, which is the essence of perfect forwarding.
    return std::make_unique<T>(std::forward<Args>(args)...);
}

int main() {
    LargeBuffer::resetCounters();

    LargeBuffer source(2048);
    LargeBuffer copied = source;
    LargeBuffer moved = std::move(source);
    assert(copied.data.size() == 2048);
    assert(moved.data.size() == 2048);

    LargeBuffer target;
    target = makeBuffer();
    assert(!target.data.empty());

    auto ticket = makeForwarded<Ticket>(std::string("AAPL"), 100);
    assert(ticket->symbol == "AAPL");
    assert(ticket->quantity == 100);

    auto returned = makeBuffer();
    assert(returned.data.size() == 1024);

    std::cout << "copy operations: " << LargeBuffer::copies << '\n';
    std::cout << "move operations: " << LargeBuffer::moves << '\n';
    assert(LargeBuffer::copies >= 1);
    assert(LargeBuffer::moves >= 1);

    return 0;
}
