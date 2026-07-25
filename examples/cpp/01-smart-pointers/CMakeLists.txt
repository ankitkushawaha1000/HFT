add_executable(smart_pointers smart-pointers.cpp)
target_compile_options(smart_pointers PRIVATE -Wall -Wextra)

add_executable(test_smart_pointers test.cpp)
target_compile_options(test_smart_pointers PRIVATE -Wall -Wextra)
add_test(NAME smart_pointers_test COMMAND test_smart_pointers)
