#include <cassert>
#include <condition_variable>
#include <iostream>
#include <mutex>
#include <queue>
#include <thread>
#include <vector>

int main() {
    int protected_counter = 0;
    std::mutex counter_mutex;
    std::vector<std::thread> workers;

    for (int i = 0; i < 4; ++i) {
        workers.emplace_back([&protected_counter, &counter_mutex]() {
            for (int n = 0; n < 1000; ++n) {
                std::lock_guard<std::mutex> lock(counter_mutex);
                ++protected_counter;
            }
        });
    }

    for (auto& worker : workers) {
        worker.join();
    }
    assert(protected_counter == 4000);

    std::queue<int> queue;
    std::mutex queue_mutex;
    std::condition_variable queue_cv;
    bool done = false;
    int processed_sum = 0;

    std::thread producer([&queue, &queue_mutex, &queue_cv]() {
        for (int value = 1; value <= 5; ++value) {
            {
                std::lock_guard<std::mutex> lock(queue_mutex);
                queue.push(value);
            }
            queue_cv.notify_one();
        }
    });

    std::thread consumer([&queue, &queue_mutex, &queue_cv, &done, &processed_sum]() {
        while (true) {
            std::unique_lock<std::mutex> lock(queue_mutex);
            queue_cv.wait(lock, [&queue, &done]() { return done || !queue.empty(); });

            if (queue.empty() && done) {
                break;
            }

            const int value = queue.front();
            queue.pop();
            lock.unlock();
            processed_sum += value;
        }
    });

    producer.join();
    {
        std::lock_guard<std::mutex> lock(queue_mutex);
        done = true;
    }
    queue_cv.notify_one();
    consumer.join();

    std::cout << "Producer-consumer sum: " << processed_sum << '\n';
    assert(processed_sum == 15);

    return 0;
}
