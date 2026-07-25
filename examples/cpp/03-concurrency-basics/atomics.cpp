#include <atomic>
#include <cassert>
#include <iostream>
#include <thread>
#include <vector>

int main() {
    std::atomic<int> counter{0};
    std::vector<std::thread> workers;

    for (int i = 0; i < 4; ++i) {
        workers.emplace_back([&counter]() {
            for (int n = 0; n < 1000; ++n) {
                counter.fetch_add(1, std::memory_order_relaxed);
            }
        });
    }

    for (auto& worker : workers) {
        worker.join();
    }
    assert(counter.load(std::memory_order_relaxed) == 4000);

    std::atomic<bool> ready{false};
    int published_value = 0;

    std::thread publisher([&ready, &published_value]() {
        published_value = 99;
        ready.store(true, std::memory_order_release);
    });

    std::thread reader([&ready, &published_value]() {
        while (!ready.load(std::memory_order_acquire)) {
        }
        assert(published_value == 99);
    });

    publisher.join();
    reader.join();

    std::cout << "Atomic counter and flag signaling completed successfully\n";
    return 0;
}
