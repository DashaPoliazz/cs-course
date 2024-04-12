const Lense = require("../Lense.js");

class Heap {
  #buffer;
  #pointers;
  #availableSize;

  #allocPointer = 0; // points to the memory that can be used for writing

  gaps = [];

  constructor(capacity) {
    this.#buffer = new ArrayBuffer(capacity);
    this.#pointers = new Map();
    this.#availableSize = capacity;
  }

  alloc(pointerName, byteLength) {
    const isMultipleOf8 = byteLength % 8 === 0;
    if (!isMultipleOf8) throw new Erorr("size % 8 !== 0");

    // firstly, we will try to fill gaps that had been occured after 'drop()'
    const gapIdx = this.gaps.length
      ? this.gaps.findIndex(([s, e]) => e - s >= byteLength)
      : -1;
    const gap = gapIdx === -1 ? false : this.gaps[gapIdx];
    const offset = gap ? gap[0] : this.#allocPointer;
    const dataView = new DataView(this.#buffer, offset, byteLength);
    const lense = new Lense(Uint8Array, dataView);

    if (gapIdx !== -1) this.gaps = this.gaps.filter((_, i) => i !== gapIdx);

    this.#pointers.set(pointerName, {
      start: gap ? gap[0] : this.#allocPointer,
      end: gap ? gap[1] : this.#allocPointer + byteLength,
      byteLength: byteLength,
    });

    if (!gap) this.#allocPointer += byteLength;
    this.#availableSize -= byteLength;

    return lense;
  }

  drop(pointerName) {
    if (!this.#pointers.has(pointerName)) return false;
    const { start, end, byteLength } = this.#pointers.get(pointerName);

    new Uint8Array(this.#buffer, start, byteLength).fill(0);
    this.#availableSize += byteLength;
    this.gaps.push([start, end]);

    return true;
  }

  debugMemory() {
    console.log(this.#buffer);
  }
}

module.exports = Heap;
