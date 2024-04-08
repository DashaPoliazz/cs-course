class Node {
  constructor(value, prev, next) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = this.tail = null;
    this.length = 0;
  }

  // Adds node to the head
  // T -> O(1)
  // S -> O(1)
  prepend(value) {
    const node = new Node(value);
    this.length += 1;

    if (!this.tail) {
      this.head = this.tail = node;
      return value;
    }

    node.next = this.head;
    this.head.prev = node;
    this.head = node;

    return value;
  }

  // Adds node to the tail
  // T -> O(1)
  // S -> O(1)
  append(value) {
    const node = new Node(value);
    this.length += 1;

    if (!this.head) {
      this.head = this.tail = node;
      return value;
    }

    node.prev = this.tail;
    this.tail.next = node;
    this.tail = node;

    return value;
  }

  // Delete first node which value === value
  // T -> O(n)
  // S -> O(1)
  delete(value) {
    // traverse until the value will be found
    let curr = this.head;
    while (curr && curr.value !== value) {
      curr = curr.next;
    }
    if (!curr) return undefined;

    this.length -= 1;

    // Delete as head
    if (curr === this.head) {
      if (this.head === this.tail) {
        this.head = this.tail = null;
        return value;
      }

      this.head.next.prev = null;
      this.head = this.head.next;

      return value;
    }
    // Delete as tail
    if (curr === this.tail) {
      this.tail.prev.next = null;
      this.tail = this.tail.prev;

      return value;
    }
    // Delete as middle element
    curr.next.prev = curr.prev;
    curr.prev.next = curr.next;

    curr.prev = null;
    curr.next = null;

    return value;
  }

  // Adding node at index
  // T -> O(n)
  // S -> O(1)
  insertAt(value, index) {
    // Index is out of the bounds
    if (index < 0 || index > this.length) return undefined;
    // index === this.elngth means "append" operation
    if (index === this.length) return this.append(value);
    // index === 0 means "prepend" opeations
    if (index === 0) return this.prepend(value);

    this.length += 1;

    let curr = this.#traverseToIndex(index);
    const node = new Node(value);

    node.prev = curr.prev;
    node.next = curr;
    curr.prev.next = node;
    curr.prev = node;

    return value;
  }

  // Returns node by it's index
  // T -> O(n)
  // S -> O(1)
  get(index) {
    const node = this.#traverseToIndex(index);
    return node ? node.value : undefined;
  }

  // Returns node whose index === index
  // T -> O(n)
  // S -> O(1)
  #traverseToIndex(index) {
    if (index < 0 || index > this.length) return undefined;

    let curr = this.head;
    while (curr && index > 0) {
      curr = curr.next;
      index -= 1;
    }

    return curr;
  }

  // Reversing ll
  // T -> O(n)
  // S -> O(1)
  reverse() {
    if (!this.head) return false;

    const newTail = this.head;
    let curr = this.head;
    let prev = null;

    while (curr) {
      const next = curr.next;
      curr.next = prev;
      curr.prev = next;
      prev = curr;
      curr = next;
    }

    this.head = prev;
    this.tail = newTail;

    return prev;
  }

  // Making it's iterable
  [Symbol.iterator]() {
    let current = this.head;

    return {
      next() {
        const node = current;
        if (node) current = current.next;
        const iterator = node
          ? { value: node.value, done: false }
          : { done: true };
        return iterator;
      },
    };
  }
}
const ll = new DoublyLinkedList();

module.exports = new DoublyLinkedList();
