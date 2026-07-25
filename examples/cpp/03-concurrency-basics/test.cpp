#include <atomic>
#include <cassert>
#include <mutex>
#include <thread>
#include <vector>

int main() {
    constexpr int thread_count = 8;
    constexpr int increments_per_thread = 10000;

    std::atomic<int> atomic_counter{0};
    int mutex_counter = 0;
    std::mutex mutex;
    std::vector<std::thread> threads;

    for (int i = 0; i < thread_count; ++i) {
        threads.emplace_back([&atomic_counter, &mutex_counter, &mutex]() {
            for (int n = 0; n < increments_per_thread; ++n) {
                atomic_counter.fetch_add(1, std::memory_order_relaxed);
                std::lock_guard<std::mutex> lock(mutex);
                ++mutex_counter;
            }
        });
    }

    for (auto& thread : threads) {
        thread.join();
    }

    const int expected = thread_count * increments_per_thread;
    assert(atomic_counter.load(std::memory_order_relaxed) == expected);
    assert(mutex_counter == expected);

    return 0;
}
