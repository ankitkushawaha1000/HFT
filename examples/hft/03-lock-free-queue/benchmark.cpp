#include <chrono>
#include <cstdint>
#include <deque>
#include <iostream>
#include <mutex>
#include <thread>
#include <type_traits>

#include "spsc-queue.h"

template <typename T>
class MutexQueue {
public:
    void push(const T& value) {
        std::lock_guard<std::mutex> lock(mutex_);
        queue_.push_back(value);
    }

    bool pop(T& value) {
        std::lock_guard<std::mutex> lock(mutex_);
        if (queue_.empty()) {
            return false;
        }
        value = queue_.front();
        queue_.pop_front();
        return true;
    }

private:
    std::deque<T> queue_;
    std::mutex mutex_;
};

template <typename Queue>
long long benchmarkQueue(const char* label, Queue& queue, int item_count) {
    const auto start = std::chrono::steady_clock::now();

    std::thread producer([&queue, item_count]() {
        for (int i = 0; i < item_count; ++i) {
            while (true) {
                if constexpr (std::is_same<Queue, MutexQueue<std::uint64_t>>::value) {
                    queue.push(static_cast<std::uint64_t>(i));
                    break;
                } else if (queue.push(static_cast<std::uint64_t>(i))) {
                    break;
                } else {
                    std::this_thread::yield();
                }
            }
        }
    });

    std::thread consumer([&queue, item_count]() {
        std::uint64_t value = 0;
        int received = 0;
        while (received < item_count) {
            if (queue.pop(value)) {
                ++received;
            } else {
                std::this_thread::yield();
            }
        }
    });

    producer.join();
    consumer.join();

    const auto end = std::chrono::steady_clock::now();
    const auto elapsed = std::chrono::duration_cast<std::chrono::microseconds>(end - start).count();
    std::cout << label << ": " << elapsed << " us\n";
    return elapsed;
}

int main() {
    constexpr int item_count = 500000;
    SPSCQueue<std::uint64_t, 4096> lock_free_queue;
    MutexQueue<std::uint64_t> mutex_queue;

    benchmarkQueue("SPSC queue", lock_free_queue, item_count);
    benchmarkQueue("Mutex queue", mutex_queue, item_count);
    return 0;
}
