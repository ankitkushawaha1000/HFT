#pragma once

#include <cstddef>
#include <cstdint>
#include <stdexcept>
#include <vector>

struct MessageHeader {
    std::uint64_t seqno = 0;
    std::uint16_t type = 0;
    std::uint16_t length = 0;
};

struct ParsedMessage {
    MessageHeader header;
    std::vector<std::uint8_t> payload;
};

class Parser {
public:
    static constexpr std::size_t kHeaderSize =
        sizeof(std::uint64_t) + sizeof(std::uint16_t) + sizeof(std::uint16_t);

    static ParsedMessage parse(const std::vector<std::uint8_t>& bytes) {
        if (bytes.size() < kHeaderSize) {
            throw std::runtime_error("packet too short");
        }

        ParsedMessage message;
        message.header.seqno = readUnsigned<std::uint64_t>(bytes, 0);
        message.header.type = readUnsigned<std::uint16_t>(bytes, 8);
        message.header.length = readUnsigned<std::uint16_t>(bytes, 10);

        if (bytes.size() != kHeaderSize + message.header.length) {
            throw std::runtime_error("payload length mismatch");
        }

        message.payload.assign(bytes.begin() + static_cast<std::ptrdiff_t>(kHeaderSize), bytes.end());
        return message;
    }

    static std::vector<std::uint8_t> encode(std::uint64_t seqno,
                                            std::uint16_t type,
                                            const std::vector<std::uint8_t>& payload) {
        if (payload.size() > 0xFFFFU) {
            throw std::runtime_error("payload too large");
        }

        std::vector<std::uint8_t> bytes;
        bytes.reserve(kHeaderSize + payload.size());
        appendUnsigned(bytes, seqno);
        appendUnsigned(bytes, type);
        appendUnsigned(bytes, static_cast<std::uint16_t>(payload.size()));
        bytes.insert(bytes.end(), payload.begin(), payload.end());
        return bytes;
    }

private:
    template <typename Integer>
    static void appendUnsigned(std::vector<std::uint8_t>& bytes, Integer value) {
        for (std::size_t i = 0; i < sizeof(Integer); ++i) {
            bytes.push_back(static_cast<std::uint8_t>((value >> (8U * i)) & 0xFFU));
        }
    }

    template <typename Integer>
    static Integer readUnsigned(const std::vector<std::uint8_t>& bytes, std::size_t offset) {
        Integer value = 0;
        for (std::size_t i = 0; i < sizeof(Integer); ++i) {
            value |= static_cast<Integer>(bytes[offset + i]) << (8U * i);
        }
        return value;
    }
};
