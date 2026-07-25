add_executable(test_order_book test.cpp)
target_compile_options(test_order_book PRIVATE -Wall -Wextra)
add_test(NAME order_book_test COMMAND test_order_book)

add_executable(benchmark_order_book benchmark.cpp)
target_compile_options(benchmark_order_book PRIVATE -Wall -Wextra -O2)
