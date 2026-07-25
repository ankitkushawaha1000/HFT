add_executable(test_ring_buffer test.cpp)
target_compile_options(test_ring_buffer PRIVATE -Wall -Wextra)
add_test(NAME ring_buffer_test COMMAND test_ring_buffer)

add_executable(benchmark_ring_buffer benchmark.cpp)
target_compile_options(benchmark_ring_buffer PRIVATE -Wall -Wextra -O2)
