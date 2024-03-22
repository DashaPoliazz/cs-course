const DoublyLinkedList = require("./doublyLinkedList.js");
const doublyLinkedList = new DoublyLinkedList();

describe("DoublyLinkedList append and prepend methods", () => {
  let list;

  beforeEach(() => {
    list = new DoublyLinkedList();
  });

  test("method 'prepend' should add element to the beginning of the list correctly", () => {
    expect(list.head).toBe(null);
    expect(list.length).toBe(0);

    expect(list.prepend("foo")).toBe("foo");
    expect(list.length).toBe(1);
    expect(list.head.value).toBe("foo");
    expect(list.tail.value).toBe("foo");

    expect(list.prepend("bar")).toBe("bar");
    expect(list.length).toBe(2);
    expect(list.head.value).toBe("bar");
    expect(list.head.next.value).toBe("foo");
    expect(list.head.next.prev.value).toBe("bar");
  });

  test("method 'append' should add element to the end", () => {
    list.append("foo");
    list.append("bar");

    expect(list.length).toBe(2);
    expect(list.head.value).toBe("foo");
    expect(list.tail.value).toBe("bar");
  });
});

describe("DoublyLinkedList delete method", () => {
  let list;

  beforeEach(() => {
    list = new DoublyLinkedList();
  });

  test("deleting the head node", () => {
    list.append("foo");
    list.append("bar");
    list.append("baz");

    expect(list.delete("foo")).toBe("foo");
    expect(list.length).toBe(2);
    expect(list.head.value).toBe("bar");
    expect(list.head.prev).toBe(null);
  });

  test("deleting the tail node", () => {
    list.append("foo");
    list.append("bar");
    list.append("baz");

    expect(list.delete("baz")).toBe("baz");
    expect(list.length).toBe(2);
    expect(list.tail.value).toBe("bar");
    expect(list.tail.next).toBe(null);
  });

  test("deleting a middle node", () => {
    list.append("foo");
    list.append("bar");
    list.append("baz");

    expect(list.delete("bar")).toBe("bar");
    expect(list.length).toBe(2);
    expect(list.head.value).toBe("foo");
    expect(list.tail.value).toBe("baz");
    expect(list.head.next.value).toBe("baz");
    expect(list.tail.prev.value).toBe("foo");
  });

  test("deleting a non-existing node", () => {
    list.append("foo");
    list.append("bar");
    list.append("baz");

    expect(list.delete("qux")).toBe(undefined);
    expect(list.length).toBe(3);
    expect(list.head.value).toBe("foo");
    expect(list.tail.value).toBe("baz");
  });

  test("deleting the only node in the list", () => {
    list.append("foo");

    expect(list.delete("foo")).toBe("foo");
    expect(list.length).toBe(0);
    expect(list.head).toBe(null);
    expect(list.tail).toBe(null);
  });
});

describe("DoublyLinkedList insertAt method", () => {
  let list;

  beforeEach(() => {
    list = new DoublyLinkedList();
  });

  test("inserting at the beginning of the list", () => {
    list.append("bar");
    list.append("baz");
    list.insertAt("foo", 0);

    expect(list.length).toBe(3);
    expect(list.head.value).toBe("foo");
    expect(list.head.next.value).toBe("bar");
    expect(list.head.next.prev.value).toBe("foo");
  });

  test("inserting at the end of the list", () => {
    list.append("foo");
    list.append("bar");
    list.insertAt("baz", 2);

    expect(list.length).toBe(3);
    expect(list.tail.value).toBe("baz");
    expect(list.tail.prev.value).toBe("bar");
    expect(list.tail.prev.next.value).toBe("baz");
  });

  test("inserting in the middle of the list", () => {
    list.append("foo");
    list.append("baz");
    list.insertAt("bar", 1);

    expect(list.length).toBe(3);
    expect(list.head.next.value).toBe("bar");
    expect(list.head.next.prev.value).toBe("foo");
    expect(list.head.next.next.value).toBe("baz");
  });

  test("inserting at invalid index", () => {
    list.append("foo");
    list.append("bar");
    expect(list.insertAt("baz", 5)).toBe(undefined);
    expect(list.length).toBe(2);
  });
});

describe("Doubly linked list get method", () => {
  let list;

  beforeEach(() => {
    list = new DoublyLinkedList();
    list.append("foo");
    list.append("bar");
    list.append("baz");
  });

  test("Should return an undefined value if it doesn't exist", () => {
    expect(list.get(4)).toBe(undefined);
    expect(list.get(-1)).toBe(undefined);
  });

  test("Should return right value on right position", () => {
    expect(list.get(0)).toBe("foo");
  });

  test("Should return right value after some actions", () => {
    list.prepend("fuzz");
    expect(list.get(0)).toBe("fuzz");
    list.append("bazz");
    expect(list.get(1)).toBe("foo");
  });
});
