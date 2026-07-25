# NVIDIA — Round 5: Onsite — System / Software Design

**What this round assesses:** Software architecture, API design, performance/scalability tradeoffs, and distributed/parallel system patterns.

## Format

45–60 min virtual whiteboard discussion, often focused on GPU/ML systems rather than generic web-scale systems.

## Representative questions

1. Design a CUDA memory allocator like `cudaMalloc`, including fragmentation and concurrent allocations from multiple streams. `anecdotal`
2. Design an inference serving framework like Triton: batching, model loading, multi-GPU scheduling, latency vs. throughput. `anecdotal + inferred`
3. Design a distributed model training system with data/model parallelism and gradient AllReduce. `anecdotal`
4. Design a GPU-accelerated data pipeline that avoids stalls between disk, CPU preprocessing, and GPU transfer. `anecdotal`
5. Design a high-performance logging system for GPU kernels that avoids perturbing performance. `anecdotal`

## Sources

- https://developer.nvidia.com/blog/ `official`
- Glassdoor NVIDIA system design `anecdotal`
