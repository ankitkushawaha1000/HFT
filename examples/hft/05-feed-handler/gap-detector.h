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
