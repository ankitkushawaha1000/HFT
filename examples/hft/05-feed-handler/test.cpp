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
