type Comparator<T> = (a: T, b: T) => boolean;

class Heap<T> {
  private lookup: T[];
  private comparator: Comparator<T>;
  public length: number;

  constructor(arr: T[] = [], comparator: Comparator<T>) {
    this.lookup = arr;
    this.comparator = comparator;
    this.length = arr.length;
  }

  // T -> O(LogN)
  // S -> O(1)
  push(value: T): void {
    // Inserting value into the end
    this.lookup.push(value);
    // Bubbling value up
    const position = this.lookup.length - 1;
    this.length += 1;
    this.heapifyUp(position);
  }

  // equal to .pop method
  shift() {
    return this.pop();
  }

  peek() {
    return this.lookup[0];
  }

  // T -> O(LogN)
  // S -> O(1)
  pop(): T | null {
    if (this.length === 0) return null;

    const out = this.lookup[0];
    // To keep the structure of heap we have to remove
    // last element and heapify it down
    this.lookup[0] = this.lookup[this.length - 1];
    this.lookup.pop();
    this.length -= 1;
    this.heapifyDown(0);

    return out;
  }

  // T -> O(LogN)
  // S -> O(1)
  private heapifyUp(idx: number): void {
    if (idx < 0 || idx >= this.length) {
      throw new Error(`${idx} is out of bounds`);
    }

    while (idx > 0) {
      const parentIdx = this.getParentIdx(idx);
      const needToSwap = this.comparator(
        this.lookup[idx],
        this.lookup[parentIdx],
      );
      if (needToSwap) {
        const tmp = this.lookup[parentIdx];
        this.lookup[parentIdx] = this.lookup[idx];
        this.lookup[idx] = tmp;
      }
      idx = parentIdx;
    }
  }

  // T -> O(LogN)
  // S -> O(1)
  private heapifyDown(idx: number, bound: number = this.length): void {
    let candidateIdx = idx;
    const leftChildIdx = this.getLeftChildIdx(idx);
    const rightChildIdx = this.getRightChildIdx(idx);

    if (
      leftChildIdx < bound &&
      this.comparator(this.lookup[leftChildIdx], this.lookup[candidateIdx])
    ) {
      candidateIdx = leftChildIdx;
    }

    if (
      rightChildIdx < bound &&
      this.comparator(this.lookup[rightChildIdx], this.lookup[candidateIdx])
    ) {
      candidateIdx = rightChildIdx;
    }

    if (candidateIdx !== idx) {
      const tmp = this.lookup[idx];
      this.lookup[idx] = this.lookup[candidateIdx];
      this.lookup[candidateIdx] = tmp;

      this.heapifyDown(candidateIdx, bound);
    }
  }

  // T -> O(NLogN)
  // S -> O(1)
  sort(): T[] {
    for (let i = Math.floor(this.lookup.length / 2) - 1; i >= 0; i--) {
      this.heapifyDown(i);
    }

    for (let i = this.length - 1; i > 0; i--) {
      // Swap head and tail
      const head = this.lookup[0];
      this.lookup[0] = this.lookup[i];
      this.lookup[i] = head;

      // Heapifying value down
      this.heapifyDown(0, i);
    }

    return this.lookup;
  }

  // T -> O(N)
  // S -> O(N)
  validate(idx: number): boolean {
    const leftChildIdx = this.getLeftChildIdx(idx);
    const rightChildIdx = this.getRightChildIdx(idx);
    const isInBounds = (idx: number) => idx >= 0 && idx < this.length;

    // Both are out of bounds
    if (!(isInBounds(leftChildIdx) && isInBounds(rightChildIdx))) return true;
    // Valid relationship case
    const parent = this.lookup[idx];
    const leftChild = this.lookup[leftChildIdx];
    const rightChild = this.lookup[rightChildIdx];
    const incorrectRelationship = !(
      this.comparator(parent, leftChild) && this.comparator(parent, rightChild)
    );
    if (incorrectRelationship) return false;

    const validLeftSubtree = this.validate(leftChildIdx);
    const validRightSubtree = this.validate(rightChildIdx);

    return validLeftSubtree && validRightSubtree;
  }

  private getParentIdx(idx: number): number {
    return Math.floor((idx - 1) / 2);
  }

  private getLeftChildIdx(idx: number): number {
    return 2 * idx + 1;
  }

  private getRightChildIdx(idx: number): number {
    return 2 * idx + 2;
  }

  private getLeftChild(idx: number): T {
    return this.lookup[this.getLeftChildIdx(idx)];
  }

  private getRightChild(idx: number): T {
    return this.lookup[this.getRightChildIdx(idx)];
  }
}

export default Heap;
