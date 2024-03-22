const DoublyLinkedList = require("./doubly-linked-list.js");

class CyclicList extends DoublyLinkedList {
  constructor() {
    super();
  }

  createCycle() {
    if (!this.tail) return false;
    this.tail.next = this.head;
    return true;
  }

  *[Symbol.iterator]() {
    let slow = this.head;
    let fast = this.head;

    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
      if (slow === fast) {
        console.log("Cycle has been detected");
        break;
      }
      yield slow.value;
    }
  }
}

const cycicdll = new CyclicList();

cycicdll.append(0);
cycicdll.append(1);
cycicdll.append(2);
cycicdll.append(3);
cycicdll.append(4);
cycicdll.append(5);
cycicdll.createCycle();

for (const node of cycicdll) {
  console.log(node);
}
