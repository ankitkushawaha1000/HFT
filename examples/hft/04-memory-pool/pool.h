#pragma once

#include <array>
#include <cstddef>
#include <cstdint>
#include <new>
#include <stdexcept>
#include <type_traits>

template <std::size_t BlockSize, std::size_t PoolCapacity>
class MemoryPool {
    static_assert(BlockSize > 0, "BlockSize must be positive");
    static_assert(PoolCapacity > 0, "PoolCapacity must be positive");

    using Storage = typename std::aligned_storage<BlockSize, alignof(std::max_align_t)>::type;

public:
    MemoryPool() : free_count_(PoolCapacity) {
        for (std::size_t i = 0; i < PoolCapacity; ++i) {
            free_list_[i] = PoolCapacity - 1 - i;
        }
    }

    void* allocate() {
        if (free_count_ == 0) {
            return nullptr;
        }

        const std::size_t index = free_list_[--free_count_];
        return &storage_[index];
    }

    void deallocate(void* pointer) {
        if (pointer == nullptr) {
            return;
        }

        const auto base = reinterpret_cast<std::uintptr_t>(&storage_[0]);
        const auto end = reinterpret_cast<std::uintptr_t>(&storage_[PoolCapacity]);
        const auto value = reinterpret_cast<std::uintptr_t>(pointer);
        if (value < base || value >= end) {
            throw std::invalid_argument("pointer does not belong to this pool");
        }

        const auto offset = value - base;
        if (offset % sizeof(Storage) != 0U) {
            throw std::invalid_argument("pointer is not aligned to a pool block");
        }

        const std::size_t index = offset / sizeof(Storage);
        free_list_[free_count_++] = index;
    }

    std::size_t available() const {
        return free_count_;
    }

    constexpr std::size_t capacity() const {
        return PoolCapacity;
    }

private:
    std::array<Storage, PoolCapacity> storage_{};
    std::array<std::size_t, PoolCapacity> free_list_{};
    std::size_t free_count_;
};
