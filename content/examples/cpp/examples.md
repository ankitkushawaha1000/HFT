# C++ Coding Examples

Representative C++ examples from `examples/cpp/` grouped by topic.

## Smart Pointers

Source folder: `examples/cpp/01-smart-pointers`.

### `smart-pointers.cpp`

```cpp
#include <cassert>
#include <chrono>
#include <functional>
#include <iostream>
#include <memory>
#include <string>

struct Resource {
    explicit Resource(std::string label) : label(std::move(label)) {
        std::cout << "Acquired " << this->label << '\n';
    }

    ~Resource() {
        std::cout << "Released " << label << '\n';
    }

    std::string label;
};

class ScopedTimer {
public:
    explicit ScopedTimer(std::string name)
        : name_(std::move(name)), start_(std::chrono::steady_clock::now()) {}

    ~ScopedTimer() {
        const auto elapsed = std::chrono::duration_cast<std::chrono::microseconds>(
            std::chrono::steady_clock::now() - start_);
        std::cout << name_ << " lived for " << elapsed.count() << " us\n";
    }

private:
    std::string name_;
    std::chrono::steady_clock::time_point start_;
};

int main() {
    // unique_ptr models exclusive ownership. Moving it transfers responsibility.
    auto unique_owner = std::make_unique<Resource>("order-state");
    auto next_owner = std::move(unique_owner);
    assert(unique_owner == nullptr);
    assert(next_owner != nullptr);

    // shared_ptr is useful when several components must keep an object alive.
    auto shared_owner = std::make_shared<Resource>("shared-cache-line");
    auto shared_copy = shared_owner;
    std::weak_ptr<Resource> observer = shared_owner;
    std::cout << "shared use_count = " << shared_owner.use_count() << '\n';
    assert(shared_owner.use_count() == 2);

    if (const auto locked = observer.lock()) {
        std::cout << "weak_ptr observed " << locked->label << '\n';
    }

    shared_owner.reset();
    shared_copy.reset();
    assert(observer.expired());

    // Custom deleters are common when a resource needs more than a plain delete.
    bool custom_deleter_called = false;
    {
        std::unique_ptr<Resource, std::function<void(Resource*)>> guarded(
            new Resource("custom-cleanup"),
            [&custom_deleter_called](Resource* resource) {
                custom_deleter_called = true;
                delete resource;
            });
        assert(guarded != nullptr);
    }
    assert(custom_deleter_called);

    // RAII means the destructor performs cleanup automatically on scope exit.
    {
        ScopedTimer timer("critical-section");
        auto scoped_resource = std::make_unique<Resource>("temporary-buffer");
        assert(scoped_resource != nullptr);
    }

    return 0;
}
```

### `test.cpp`

```cpp
#include <cassert>
#include <functional>
#include <memory>

struct Resource {
    explicit Resource(int value) : value(value) {}
    int value;
};

int main() {
    {
        auto first = std::make_unique<Resource>(7);
        auto second = std::move(first);
        assert(first == nullptr);
        assert(second != nullptr);
        assert(second->value == 7);
    }

    {
        auto shared = std::make_shared<Resource>(11);
        assert(shared.use_count() == 1);
        auto second = shared;
        assert(shared.use_count() == 2);
        second.reset();
        assert(shared.use_count() == 1);
    }

    {
        std::weak_ptr<Resource> weak;
        {
            auto shared = std::make_shared<Resource>(13);
            weak = shared;
            assert(!weak.expired());
        }
        assert(weak.expired());
    }

    {
        int delete_count = 0;
        {
            std::unique_ptr<Resource, std::function<void(Resource*)>> guarded(
                new Resource(42),
                [&delete_count](Resource* resource) {
                    ++delete_count;
                    delete resource;
                });
            assert(guarded->value == 42);
        }
        assert(delete_count == 1);
    }

    return 0;
}
```

## Move Semantics

Source folder: `examples/cpp/02-move-semantics`.

### `benchmark.cpp`

```cpp
#include <chrono>
#include <iostream>
#include <utility>
#include <vector>

struct Payload {
    explicit Payload(std::size_t size) : values(size, 7) {}
    std::vector<int> values;
};

int main() {
    constexpr std::size_t element_count = 1U << 20U;
    constexpr int iterations = 200;

    Payload source(element_count);
    std::size_t checksum = 0;

    const auto copy_start = std::chrono::steady_clock::now();
    for (int i = 0; i < iterations; ++i) {
        Payload copied = source;
        checksum += copied.values.size();
    }
    const auto copy_end = std::chrono::steady_clock::now();

    const auto move_start = std::chrono::steady_clock::now();
    for (int i = 0; i < iterations; ++i) {
        Payload fresh(element_count);
        Payload moved = std::move(fresh);
        checksum += moved.values.size();
    }
    const auto move_end = std::chrono::steady_clock::now();

    const auto copy_us = std::chrono::duration_cast<std::chrono::microseconds>(copy_end - copy_start);
    const auto move_us = std::chrono::duration_cast<std::chrono::microseconds>(move_end - move_start);

    std::cout << "Copy benchmark: " << copy_us.count() << " us\n";
    std::cout << "Move benchmark: " << move_us.count() << " us\n";
    std::cout << "Checksum: " << checksum << '\n';

    return 0;
}
```

### `move-semantics.cpp`

```cpp
#include <cassert>
#include <iostream>
#include <memory>
#include <string>
#include <utility>
#include <vector>

struct LargeBuffer {
    explicit LargeBuffer(std::size_t size = 0) : data(size, 1) {}

    LargeBuffer(const LargeBuffer& other) : data(other.data) {
        ++copies;
    }

    LargeBuffer(LargeBuffer&& other) noexcept : data(std::move(other.data)) {
        ++moves;
    }

    LargeBuffer& operator=(const LargeBuffer& other) {
        if (this != &other) {
            data = other.data;
            ++copies;
        }
        return *this;
    }

    LargeBuffer& operator=(LargeBuffer&& other) noexcept {
        if (this != &other) {
            data = std::move(other.data);
            ++moves;
        }
        return *this;
    }

    static void resetCounters() {
        copies = 0;
        moves = 0;
    }

    static inline int copies = 0;
    static inline int moves = 0;
    std::vector<int> data;
};

struct Ticket {
    Ticket(std::string symbol, int quantity)
        : symbol(std::move(symbol)), quantity(quantity) {}

    std::string symbol;
    int quantity;
};

LargeBuffer makeBuffer() {
    LargeBuffer buffer(1024);
    return buffer; // Copy elision / RVO usually constructs directly in the caller.
}

template <typename T, typename... Args>
std::unique_ptr<T> makeForwarded(Args&&... args) {
    // std::forward preserves lvalues and rvalues, which is the essence of perfect forwarding.
    return std::make_unique<T>(std::forward<Args>(args)...);
}

int main() {
    LargeBuffer::resetCounters();

    LargeBuffer source(2048);
    LargeBuffer copied = source;
    LargeBuffer moved = std::move(source);
    assert(copied.data.size() == 2048);
    assert(moved.data.size() == 2048);

    LargeBuffer target;
    target = makeBuffer();
    assert(!target.data.empty());

    auto ticket = makeForwarded<Ticket>(std::string("AAPL"), 100);
    assert(ticket->symbol == "AAPL");
    assert(ticket->quantity == 100);

    auto returned = makeBuffer();
    assert(returned.data.size() == 1024);

    std::cout << "copy operations: " << LargeBuffer::copies << '\n';
    std::cout << "move operations: " << LargeBuffer::moves << '\n';
    assert(LargeBuffer::copies >= 1);
    assert(LargeBuffer::moves >= 1);

    return 0;
}
```

## Concurrency Basics

Source folder: `examples/cpp/03-concurrency-basics`.

### `atomics.cpp`

```cpp
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
```

### `test.cpp`

```cpp
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
```

### `threads.cpp`

```cpp
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
```

## Atomics

Source folder: `examples/cpp/04-atomics`.

### `atomics.cpp`

```cpp
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
```

### `memory-ordering.cpp`

```cpp
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
```
