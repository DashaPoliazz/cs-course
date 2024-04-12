# Lense

The Lense class provides a convenient way to interact with frame buffers stored in memory. It facilitates reading and writing data as if working with an array. The Lense object is returned by methods such as **.pop()**, **.peek()**, and **.push()** of classes like Heap and Stack. Requests such as **.get(idx)** and **.set(idx)** are used to access elements within the buffer, with indexes being automatically converted to the correct offsets.

```
// Example usage
const memoryManager = new MemoryManager(0, 70);
const memoryChunk1 = new Uint8Array([1, 2, 3]);
const lense0 = memoryManager.pushStack(memoryChunk1);

console.log("lense0.set(0)", lense0.set(0, 2));
console.log("lense0.get(0)", lense0.get(0)); // 2
console.log("lense0.get(1)", lense0.get(1)); // 2
console.log("lense0.get(2)", lense0.get(2)); // 3
console.log(...lense0.values()); // 2, 2, 3
```

# MemoryManager

The MemoryManager class manages memory allocation and provides methods for working with both stack and heap memory. It internally utilizes Heap and Stack classes to manage frame buffers and their associated data. The MemoryManager constructor takes parameters for defining the size of heap and stack memory.

```
// Example usage
const memoryManager = new MemoryManager(80, 70);
const memoryChunk = new Uint8Array([1, 2, 3]);
const lense1 = memoryManager.pushStack(memoryChunk);
const lense2 = memoryManager.allocHeap(8);
```

# Heap

The Heap class represents memory storage for dynamic allocation. It allocates memory in a way that optimizes space utilization and enables efficient allocation and deallocation of memory chunks. The Heap class internally manages memory using an ArrayBuffer and provides methods for allocating and deallocating memory chunks.

The Heap works only with Uint8 values. Heap allocation optimizations implemented by filling all gaps which occures after dropping some data.

```
// Example usage
const heap = new Heap(80);
const writePointer = heap.alloc("writePointer", 8);
writePointer.set(0, 1);
writePointer.set(1, 2);
console.log(...writePointer.values()); // 1, 2
```

# Stack

The Stack class represents a stack-based memory storage mechanism. It manages memory in a Last In, First Out (LIFO) manner, where elements are added and removed from the top of the stack. The Stack class internally utilizes an ArrayBuffer and provides methods for pushing, popping, and peeking elements from the stack.

Each **push(frameBuffer)** creates frame. It's better to see it's on the picture than eplain how it works. It's pretty simple.

![alt text](image.png)

\*each cell takes 1 byte
