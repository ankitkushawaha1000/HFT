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
