add_executable(test_feed_handler test.cpp)
target_compile_options(test_feed_handler PRIVATE -Wall -Wextra)
add_test(NAME feed_handler_test COMMAND test_feed_handler)
