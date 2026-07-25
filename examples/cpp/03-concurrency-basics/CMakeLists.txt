find_package(Threads REQUIRED)
add_executable(threads threads.cpp)
target_link_libraries(threads Threads::Threads)
target_compile_options(threads PRIVATE -Wall -Wextra)

add_executable(atomics atomics.cpp)
target_link_libraries(atomics Threads::Threads)
target_compile_options(atomics PRIVATE -Wall -Wextra)

add_executable(test_concurrency test.cpp)
target_link_libraries(test_concurrency Threads::Threads)
target_compile_options(test_concurrency PRIVATE -Wall -Wextra)
add_test(NAME concurrency_test COMMAND test_concurrency)
