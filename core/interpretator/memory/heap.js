class MinHeap {
  constructor() {
    this.length = 0;
    this.lookup = [];
  }

  get() {
    return this.lookup[0];
  }

  insert(value) {
    this.lookup.push(value);
    this.length += 1;
    const idx = this.lookup.length - 1;
    this.heapifyUp(idx);
  }

  delete() {
    if (!this.length) return -1;

    const out = this.lookup[0];
    this.length--;

    if (this.length === 0) {
      this.lookup = [];
      return out;
    }

    this.lookup[0] = this.lookup[this.length];
    this.lookup.pop();
    this.heapifyDown(0);

    return out;
  }

  getParentIdx(idx) {
    const parentIdx = Math.floor((idx - 1) / 2);
    return parentIdx >= 0 && parentIdx < this.length ? parentIdx : -1;
  }

  getLeftChildIdx(idx) {
    const leftChildIdx = idx * 2 + 1;
    return leftChildIdx < this.length ? leftChildIdx : -1;
  }

  getRightChildIdx(idx) {
    const rightChildIdx = idx * 2 + 2;
    return rightChildIdx < this.length ? rightChildIdx : -1;
  }

  heapifyUp(idx) {
    if (idx <= 0) {
      return;
    }
    const parentIdx = this.getParentIdx(idx);
    if (parentIdx === -1 || this.lookup[parentIdx] < this.lookup[idx]) {
      return;
    }

    const tmp = this.lookup[idx];
    this.lookup[idx] = this.lookup[parentIdx];
    this.lookup[parentIdx] = tmp;

    this.heapifyUp(parentIdx);
  }

  heapifyDown(idx) {
    if (idx < 0 || idx >= this.length) return;

    const leftChildIdx = this.getLeftChildIdx(idx);
    const leftChildValue = this.lookup[leftChildIdx];
    const rightChildIdx = this.getRightChildIdx(idx);
    const rightChildValue = this.lookup[rightChildIdx];

    if (leftChildValue < rightChildValue && this.lookup[idx] > leftChildValue) {
      this.lookup[leftChildIdx] = this.lookup[idx];
      this.lookup[idx] = leftChildValue;
      this.heapifyDown(leftChildIdx);
    }
    if (
      rightChildValue < leftChildValue &&
      this.lookup[idx] > rightChildValue
    ) {
      this.lookup[rightChildIdx] = this.lookup[idx];
      this.lookup[idx] = rightChildValue;
      this.heapifyDown(rightChildIdx);
    }
  }
}

module.exports = new MinHeap();
