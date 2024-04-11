const { getContextifiedGetSet } = require("../helpers/helpers.js");

class Lense {
  #TypedArray;
  #get;
  #set;

  constructor(TypedArray, dataView) {
    this.#TypedArray = TypedArray;
    const [get, set] = getContextifiedGetSet(TypedArray, dataView);
    this.#get = get;
    this.#set = set;
    this.length = dataView.byteLength / TypedArray.BYTES_PER_ELEMENT;
  }

  get(idx) {
    if (idx > this.length)
      throw new Error(`Out of bounds error. 0 <= ${idx} < ${this.length}`);
    const offset = this.#TypedArray.BYTES_PER_ELEMENT * idx;
    return this.#get(offset, true);
  }

  set(idx, value) {
    if (idx > this.length)
      throw new Error(`Out of bounds error. 0 <= ${idx} < ${this.length}`);
    const offset = this.#TypedArray.BYTES_PER_ELEMENT * idx;
    return this.#set(offset, value, true);
  }

  *values() {
    for (let i = 0; i < this.length; i++) {
      yield this.get(i);
    }
  }
}

module.exports = Lense;
