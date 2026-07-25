#include <atomic>
#include <cassert>
#include <cstdint>
#include <iostream>
#include <thread>
#include <vector>

class SpinLock {
public:
    void lock() {
        while (flag_.test_and_set(std::memory_order_acquire)) {
        }
    }

    void unlock() {
        flag_.clear(std::memory_order_release);
    }

private:
    std::atomic_flag flag_ = ATOMIC_FLAG_INIT;
};

void demoRelaxed() {
    std::atomic<int> counter{0};
    std::vector<std::thread> threads;
    for (int i = 0; i < 4; ++i) {
        threads.emplace_back([&counter]() {
            for (int n = 0; n < 1000; ++n) {
                // relaxed is ideal when we only need atomicity, not cross-thread ordering.
                counter.fetch_add(1, std::memory_order_relaxed);
            }
        });
    }

    for (auto& thread : threads) {
        thread.join();
    }
    assert(counter.load(std::memory_order_relaxed) == 4000);
}

void demoReleaseAcquire() {
    std::atomic<bool> ready{false};
    int payload = 0;

    std::thread writer([&ready, &payload]() {
        payload = 1234;
        ready.store(true, std::memory_order_release);
    });

    std::thread reader([&ready, &payload]() {
        while (!ready.load(std::memory_order_acquire)) {
        }
        assert(payload == 1234);
    });

    writer.join();
    reader.join();
}

void demoConsume() {
    int market_data = 77;
    std::atomic<int*> published{nullptr};

    std::thread writer([&published, &market_data]() {
        published.store(&market_data, std::memory_order_release);
    });

    std::thread reader([&published]() {
        // consume is intended for dependency ordering. Most compilers currently
        // implement it as acquire, which is a conservative and safe choice.
        int* observed = nullptr;
        while ((observed = published.load(std::memory_order_consume)) == nullptr) {
        }
        assert(*observed == 77);
    });

    writer.join();
    reader.join();
}

void demoAcqRelExchange() {
    std::atomic<int> state{0};
    const int old_value = state.exchange(5, std::memory_order_acq_rel);
    assert(old_value == 0);
    assert(state.load(std::memory_order_acquire) == 5);
}

void demoSeqCst() {
    std::atomic<int> x{0};
    std::atomic<int> y{0};

    x.store(1, std::memory_order_seq_cst);
    y.store(1, std::memory_order_seq_cst);
    assert(x.load(std::memory_order_seq_cst) == 1);
    assert(y.load(std::memory_order_seq_cst) == 1);
}

void demoSpinLock() {
    SpinLock lock;
    std::int64_t total = 0;
    std::vector<std::thread> threads;

    for (int i = 0; i < 4; ++i) {
        threads.emplace_back([&lock, &total]() {
            for (int n = 0; n < 500; ++n) {
                lock.lock();
                ++total;
                lock.unlock();
            }
        });
    }

    for (auto& thread : threads) {
        thread.join();
    }
    assert(total == 2000);
}

void demoSpscFlag() {
    std::atomic<bool> has_value{false};
    int slot = 0;

    std::thread producer([&has_value, &slot]() {
        slot = 55;
        has_value.store(true, std::memory_order_release);
    });

    std::thread consumer([&has_value, &slot]() {
        while (!has_value.load(std::memory_order_acquire)) {
        }
        assert(slot == 55);
    });

    producer.join();
    consumer.join();
}

int main() {
    demoRelaxed();
    demoReleaseAcquire();
    demoConsume();
    demoAcqRelExchange();
    demoSeqCst();
    demoSpinLock();
    demoSpscFlag();

    std::cout << "Demonstrated relaxed, consume, acquire, release, acq_rel and seq_cst orderings\n";
    return 0;
}
