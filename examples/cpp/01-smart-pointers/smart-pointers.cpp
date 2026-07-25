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
