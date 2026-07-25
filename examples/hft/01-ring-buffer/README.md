# Ring Buffer

This example implements a fixed-capacity ring buffer for trivially copyable types. Push and pop are both `O(1)` and use simple index arithmetic, which is why ring buffers are common in HFT hot paths.

Typical HFT uses include staging market data events, recycling packet descriptors, and building SPSC queues. The design here is intentionally non-thread-safe so the data structure stays easy to reason about before moving on to lock-free variants.
