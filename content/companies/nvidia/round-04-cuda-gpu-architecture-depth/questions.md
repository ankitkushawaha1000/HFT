# NVIDIA — Round 4: Onsite — CUDA / GPU Architecture Depth

**What this round assesses:** GPU memory hierarchy, CUDA programming model, performance optimization, and parallel algorithm design.

## Format

1–2 whiteboard/doc or coding rounds, 45–60 min each; may require CUDA code, pseudocode, or architecture discussion.

## Representative questions

1. Explain the CUDA memory hierarchy: global memory, shared memory, L1/L2 cache, and registers; when would you use each? `anecdotal + inferred`
2. Implement a parallel reduction in CUDA and explain how to handle warp divergence. `anecdotal`
3. What is warp divergence? Write high-divergence code and restructure it. `anecdotal`
4. Explain coalesced memory access and rewrite non-coalesced access to be coalesced. `anecdotal + inferred`
5. Implement matrix multiplication using shared-memory tiling and justify tile size. `anecdotal`
6. What is occupancy in a CUDA kernel? What limits it and how would you measure it? `anecdotal + inferred`
7. Explain CUDA streams and how to overlap CPU work with GPU kernel execution. `anecdotal`
8. When would you use `atomicAdd` vs. a warp shuffle for reduction? `anecdotal`
9. Explain how a CUDA kernel is launched and dispatched from CPU to GPU. `anecdotal`
10. Implement a parallel prefix scan using Hillis-Steele or Blelloch. `anecdotal`
11. Optimize convolution for GPU using tiling, shared-memory reuse, and vectorized loads. `anecdotal`
12. What is unified memory in CUDA? When is it useful and when is it not? `anecdotal + inferred`

## Sources

- https://docs.nvidia.com/cuda/cuda-c-programming-guide/ `official`
- https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/ `official`
- Glassdoor NVIDIA CUDA interview reports `anecdotal`
