#include <cassert>
#include <cstdint>
#include <thread>

#include "spsc-queue.h"

int main() {
    {
        SPSCQueue<int, 8> queue;
        int value = 0;
        assert(queue.empty());
        assert(queue.push(1));
        assert(queue.push(2));
        assert(queue.pop(value) && value == 1);
        assert(queue.pop(value) && value == 2);
        assert(!queue.pop(value));
    }

    {
        constexpr int item_count = 100000;
        SPSCQueue<std::uint64_t, 1024> queue;
        std::uint64_t sum = 0;

        std::thread producer([&queue]() {
            for (int i = 1; i <= item_count; ++i) {
                while (!queue.push(static_cast<std::uint64_t>(i))) {
                    std::this_thread::yield();
                }
            }
        });

        std::thread consumer([&queue, &sum]() {
            int received = 0;
            std::uint64_t value = 0;
            while (received < item_count) {
                if (queue.pop(value)) {
                    sum += value;
                    ++received;
                } else {
                    std::this_thread::yield();
                }
            }
        });

        producer.join();
        consumer.join();

        const std::uint64_t expected =
            static_cast<std::uint64_t>(item_count) * static_cast<std::uint64_t>(item_count + 1) / 2U;
        assert(sum == expected);
    }

    return 0;
}
