find_package(Threads REQUIRED)
add_executable(atomics_demo atomics.cpp)
target_link_libraries(atomics_demo Threads::Threads)
target_compile_options(atomics_demo PRIVATE -Wall -Wextra)

add_executable(memory_ordering memory-ordering.cpp)
target_link_libraries(memory_ordering Threads::Threads)
target_compile_options(memory_ordering PRIVATE -Wall -Wextra)
add_test(NAME atomics_test COMMAND atomics_demo)
