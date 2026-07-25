#include <atomic>
#include <cassert>
#include <iostream>
#include <thread>

struct SharedState {
    int payload = 0;
    std::atomic<bool> ready{false};
};

void acquireReleaseProtocol() {
    SharedState state;

    std::thread writer([&state]() {
        state.payload = 2024;
        state.ready.store(true, std::memory_order_release);
    });

    std::thread reader([&state]() {
        while (!state.ready.load(std::memory_order_acquire)) {
        }
        assert(state.payload == 2024);
    });

    writer.join();
    reader.join();
}

void relaxedDiscussionDemo() {
    std::atomic<int> data{0};
    std::atomic<int> flag{0};
    int stale_observations = 0;

    for (int iteration = 1; iteration <= 1000; ++iteration) {
        data.store(0, std::memory_order_relaxed);
        flag.store(0, std::memory_order_relaxed);

        std::thread writer([&data, &flag, iteration]() {
            data.store(iteration, std::memory_order_relaxed);
            flag.store(iteration, std::memory_order_relaxed);
        });

        std::thread reader([&data, &flag, iteration, &stale_observations]() {
            while (flag.load(std::memory_order_relaxed) != iteration) {
            }

            // On strong hardware this counter is often zero. The important lesson is
            // that relaxed ordering does not promise the reader sees data after the flag.
            if (data.load(std::memory_order_relaxed) != iteration) {
                ++stale_observations;
            }
        });

        writer.join();
        reader.join();
    }

    std::cout << "Relaxed protocol stale observations: " << stale_observations << '\n';
}

int main() {
    acquireReleaseProtocol();
    relaxedDiscussionDemo();
    return 0;
}
