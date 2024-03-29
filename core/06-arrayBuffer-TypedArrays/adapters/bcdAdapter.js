const Adapter = require("./mainAdapter.js");

class BCDAdapter extends Adapter {
  constructor(entity) {
    if (!(entity instanceof BCD)) {
      throw new Error(`Entity is instance of BCD class`);
    }

    super(entity);
    // Maybe error!
    this.serialized = entity.serialized;
    this.initialEntity = entity.initialEntity;

    const bcd = entity;

    this.byteLength = bcd.byteLength;
    this.buff = new ArrayBuffer(this.byteLength);
    this.u8Array = new Uint8Array(this.buff);
  }

  get byteLength() {
    return this.byteLength;
  }

  get buffer() {
    return this.buff;
  }

  get u8Array() {
    return this.u8Array;
  }
}

module.exports = BCDAdapter;
