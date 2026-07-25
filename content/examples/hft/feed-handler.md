# HFT Coding Example — Feed Handler

Source folder: `examples/hft/05-feed-handler`.

## Source Files

### `feed-handler.h`

```cpp
#pragma once

#include <cstdint>
#include <functional>
#include <map>
#include <utility>
#include <vector>

class FeedHandler {
public:
    using MessageCallback = std::function<void(std::uint64_t, const std::vector<std::uint8_t>&)>;

    explicit FeedHandler(std::uint64_t starting_sequence = 1)
        : expected_sequence_(starting_sequence) {}

    void setOnMessage(MessageCallback callback) {
        on_message_ = std::move(callback);
    }

    void processPacket(std::uint64_t seqno, const std::vector<std::uint8_t>& data) {
        if (seqno < expected_sequence_) {
            return;
        }

        if (seqno == expected_sequence_) {
            deliver(seqno, data);
            ++expected_sequence_;
            drainPending();
            return;
        }

        pending_.emplace(seqno, data);
    }

    std::uint64_t expectedSequence() const {
        return expected_sequence_;
    }

    std::size_t queuedPackets() const {
        return pending_.size();
    }

private:
    void deliver(std::uint64_t seqno, const std::vector<std::uint8_t>& data) const {
        if (on_message_) {
            on_message_(seqno, data);
        }
    }

    void drainPending() {
        while (true) {
            const auto found = pending_.find(expected_sequence_);
            if (found == pending_.end()) {
                break;
            }

            const auto payload = found->second;
            pending_.erase(found);
            deliver(expected_sequence_, payload);
            ++expected_sequence_;
        }
    }

    std::uint64_t expected_sequence_;
    std::map<std::uint64_t, std::vector<std::uint8_t>> pending_;
    MessageCallback on_message_;
};
```

### `gap-detector.h`

```cpp
#pragma once

#include <algorithm>
#include <chrono>
#include <cstdint>
#include <functional>
#include <optional>

class GapDetector {
public:
    using Clock = std::chrono::steady_clock;
    using RetransmitCallback = std::function<void(std::uint64_t, std::uint64_t)>;

    GapDetector(std::chrono::milliseconds timeout, RetransmitCallback callback)
        : timeout_(timeout), callback_(std::move(callback)) {}

    void observeGap(std::uint64_t first_missing,
                    std::uint64_t last_missing,
                    Clock::time_point now = Clock::now()) {
        if (!gap_.has_value()) {
            gap_ = Gap{first_missing, last_missing, now, false};
            return;
        }

        gap_->first_missing = std::min(gap_->first_missing, first_missing);
        gap_->last_missing = std::max(gap_->last_missing, last_missing);
        gap_->first_seen = std::min(gap_->first_seen, now);
    }

    void resolveThrough(std::uint64_t sequence) {
        if (!gap_.has_value()) {
            return;
        }

        if (sequence >= gap_->last_missing) {
            gap_.reset();
        } else if (sequence >= gap_->first_missing) {
            gap_->first_missing = sequence + 1;
            gap_->requested = false;
        }
    }

    void poll(Clock::time_point now = Clock::now()) {
        if (!gap_.has_value() || gap_->requested) {
            return;
        }

        if (now - gap_->first_seen >= timeout_) {
            callback_(gap_->first_missing, gap_->last_missing);
            gap_->requested = true;
        }
    }

    bool hasActiveGap() const {
        return gap_.has_value();
    }

private:
    struct Gap {
        std::uint64_t first_missing;
        std::uint64_t last_missing;
        Clock::time_point first_seen;
        bool requested;
    };

    std::chrono::milliseconds timeout_;
    RetransmitCallback callback_;
    std::optional<Gap> gap_;
};
```

### `parser.h`

```cpp
#pragma once

#include <cstddef>
#include <cstdint>
#include <stdexcept>
#include <vector>

struct MessageHeader {
    std::uint64_t seqno = 0;
    std::uint16_t type = 0;
    std::uint16_t length = 0;
};

struct ParsedMessage {
    MessageHeader header;
    std::vector<std::uint8_t> payload;
};

class Parser {
public:
    static constexpr std::size_t kHeaderSize =
        sizeof(std::uint64_t) + sizeof(std::uint16_t) + sizeof(std::uint16_t);

    static ParsedMessage parse(const std::vector<std::uint8_t>& bytes) {
        if (bytes.size() < kHeaderSize) {
            throw std::runtime_error("packet too short");
        }

        ParsedMessage message;
        message.header.seqno = readUnsigned<std::uint64_t>(bytes, 0);
        message.header.type = readUnsigned<std::uint16_t>(bytes, 8);
        message.header.length = readUnsigned<std::uint16_t>(bytes, 10);

        if (bytes.size() != kHeaderSize + message.header.length) {
            throw std::runtime_error("payload length mismatch");
        }

        message.payload.assign(bytes.begin() + static_cast<std::ptrdiff_t>(kHeaderSize), bytes.end());
        return message;
    }

    static std::vector<std::uint8_t> encode(std::uint64_t seqno,
                                            std::uint16_t type,
                                            const std::vector<std::uint8_t>& payload) {
        if (payload.size() > 0xFFFFU) {
            throw std::runtime_error("payload too large");
        }

        std::vector<std::uint8_t> bytes;
        bytes.reserve(kHeaderSize + payload.size());
        appendUnsigned(bytes, seqno);
        appendUnsigned(bytes, type);
        appendUnsigned(bytes, static_cast<std::uint16_t>(payload.size()));
        bytes.insert(bytes.end(), payload.begin(), payload.end());
        return bytes;
    }

private:
    template <typename Integer>
    static void appendUnsigned(std::vector<std::uint8_t>& bytes, Integer value) {
        for (std::size_t i = 0; i < sizeof(Integer); ++i) {
            bytes.push_back(static_cast<std::uint8_t>((value >> (8U * i)) & 0xFFU));
        }
    }

    template <typename Integer>
    static Integer readUnsigned(const std::vector<std::uint8_t>& bytes, std::size_t offset) {
        Integer value = 0;
        for (std::size_t i = 0; i < sizeof(Integer); ++i) {
            value |= static_cast<Integer>(bytes[offset + i]) << (8U * i);
        }
        return value;
    }
};
```

### `test.cpp`

```cpp
#include <cassert>
#include <chrono>
#include <cstdint>
#include <vector>

#include "feed-handler.h"
#include "gap-detector.h"
#include "parser.h"

int main() {
    {
        FeedHandler handler(1);
        std::vector<std::uint64_t> delivered;
        handler.setOnMessage([&delivered](std::uint64_t seqno, const std::vector<std::uint8_t>&) {
            delivered.push_back(seqno);
        });

        handler.processPacket(1, {1});
        handler.processPacket(2, {2});
        assert(delivered.size() == 2);
        assert(delivered[0] == 1);
        assert(delivered[1] == 2);
    }

    {
        FeedHandler handler(10);
        std::vector<std::uint64_t> delivered;
        handler.setOnMessage([&delivered](std::uint64_t seqno, const std::vector<std::uint8_t>&) {
            delivered.push_back(seqno);
        });

        handler.processPacket(10, {10});
        handler.processPacket(12, {12});
        assert(handler.queuedPackets() == 1);
        handler.processPacket(11, {11});
        assert(handler.queuedPackets() == 0);
        assert((delivered == std::vector<std::uint64_t>{10, 11, 12}));
    }

    {
        std::vector<std::pair<std::uint64_t, std::uint64_t>> requests;
        GapDetector detector(
            std::chrono::milliseconds(10),
            [&requests](std::uint64_t first, std::uint64_t last) { requests.emplace_back(first, last); });

        const auto start = GapDetector::Clock::now();
        detector.observeGap(20, 21, start);
        detector.poll(start + std::chrono::milliseconds(5));
        assert(requests.empty());
        detector.poll(start + std::chrono::milliseconds(15));
        assert(requests.size() == 1);
        assert(requests.front().first == 20);
        assert(requests.front().second == 21);
        detector.resolveThrough(21);
        assert(!detector.hasActiveGap());
    }

    {
        const auto encoded = Parser::encode(33, 7, {1, 2, 3, 4});
        const auto parsed = Parser::parse(encoded);
        assert(parsed.header.seqno == 33);
        assert(parsed.header.type == 7);
        assert(parsed.header.length == 4);
        assert(parsed.payload.size() == 4);
        assert(parsed.payload[2] == 3);
    }

    return 0;
}
```
