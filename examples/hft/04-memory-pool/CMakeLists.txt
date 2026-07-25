add_executable(test_memory_pool test.cpp)
target_compile_options(test_memory_pool PRIVATE -Wall -Wextra)
add_test(NAME memory_pool_test COMMAND test_memory_pool)

add_executable(benchmark_memory_pool benchmark.cpp)
target_compile_options(benchmark_memory_pool PRIVATE -Wall -Wextra -O2)
