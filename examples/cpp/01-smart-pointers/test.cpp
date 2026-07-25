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
