find_package(Threads REQUIRED)
add_executable(test_spsc test.cpp)
target_link_libraries(test_spsc Threads::Threads)
target_compile_options(test_spsc PRIVATE -Wall -Wextra)
add_test(NAME spsc_test COMMAND test_spsc)

add_executable(benchmark_spsc benchmark.cpp)
target_link_libraries(benchmark_spsc Threads::Threads)
target_compile_options(benchmark_spsc PRIVATE -O2 -Wall -Wextra)
