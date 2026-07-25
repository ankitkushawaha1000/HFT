add_executable(move_semantics move-semantics.cpp)
target_compile_options(move_semantics PRIVATE -Wall -Wextra)

add_executable(benchmark_move benchmark.cpp)
target_compile_options(benchmark_move PRIVATE -Wall -Wextra -O2)
add_test(NAME move_semantics_test COMMAND move_semantics)
