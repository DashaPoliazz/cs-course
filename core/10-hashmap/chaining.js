"use strict";

const DoublyLinkedList = require("../05-linked-list/doubly-linked-list.js");

const hashFn = (str) => {
  return [...str].reduce((s, c, i) => s + c.charCodeAt() * (i + 1), 0);
};

class HashMap {
  #MAX_LOAD_FACTOR = 0.6;
  #GROWTH_FACTOR = 1.7;
  #BUCKETS_COUNT = 100;

  #hashFn;
  #buckets;

  // Keeps element were added in correct sequence
  #keys = new Set();

  length = 0;

  constructor(hashFn) {
    this.#hashFn = hashFn;

    this.#initBuckets();
  }

  get(key) {
    const hash = this.#hashFn(key);
    const bucketIdx = this.#getbucketIdx(hash);
    const chain = this.#buckets[bucketIdx];
    if (!chain) return;
    for (const node of chain) if (node.key === key) return node.value;
  }
  set(key, value) {
    if (this.#needToReallocate()) this.#realloc();

    this.length += 1;
    if (!this.#keys.has(key)) this.#keys.add(key);

    const hash = this.#hashFn(key);
    const bucketIdx = this.#getbucketIdx(hash);
    const chain = this.#buckets[bucketIdx];

    const node = { key, value };

    // There is no value in the bucket
    if (!chain) {
      const chain = new DoublyLinkedList();
      this.#buckets[bucketIdx] = chain;
      chain.append(node);
      return true;
    }

    // Overwriting node if it's already exists
    const alreadyExists = chain.find((node) => node.key === key);
    if (alreadyExists) {
      alreadyExists.value = node;
      this.length -= 1;
      return true;
    }

    // Otherwise just append
    chain.append(node);

    return true;
  }
  clear() {
    this.#buckets.fill(0);
    this.#keys.clear();
    this.length = 0;
  }
  has(key) {
    return this.#keys.has(key);
  }
  delete(key) {
    const hash = this.#hashFn(key);
    const bucketIdx = this.#getbucketIdx(hash);
    const chain = this.#buckets[bucketIdx];
    if (!chain) return;
    this.length -= 1;
    this.#keys.delete(key);
    return chain.delete((v) => v.key === key);
  }

  #initBuckets() {
    this.#buckets = new Array(this.#BUCKETS_COUNT).fill(0);
  }
  #realloc() {
    this.#BUCKETS_COUNT = Math.floor(this.#BUCKETS_COUNT * this.#GROWTH_FACTOR);
    const buckets = this.#buckets;
    this.#initBuckets();
    this.length = 0;
    for (const chain of buckets) {
      if (!chain) continue;
      for (const { key, value } of chain) this.set(key, value);
    }
  }
  #needToReallocate() {
    const currentLoadFactor = this.length / this.#BUCKETS_COUNT;
    return currentLoadFactor > this.#MAX_LOAD_FACTOR;
  }
  #getbucketIdx(hash) {
    return hash % this.#BUCKETS_COUNT;
  }

  *values() {
    for (const key of this.#keys) {
      yield this.get(key);
    }
  }

  *keys() {
    yield* this.#keys;
  }

  *entries() {
    for (const key of this.#keys) {
      const value = this.get(key);
      yield [key, value];
    }
  }

  debugBuckets(msg) {
    console.log(msg, this.#buckets);
  }
  debugCollection(msg) {
    console.log(msg, this.#keys);
  }
}

// {
//   // Usages:
//   const m = new HashMap(hashFn);

//   m.set("k1", 1); // true
//   m.set("k2", [1, 2, 3]); // true
//   m.set("k3", { foo: "bar" }); // true

//   m.debugBuckets("after add 3");

//   console.log(m.get("k1")); // 1
//   console.log(m.get("k2")); // [1, 2, 3]
//   console.log(m.get("k3")); // { foo: "bar" }
//   console.log(m.get("k4")); // undefined -> key doesn't exists
// }

// {
//   // Trigger realloc
//   const m = new HashMap(hashFn);

//   // MAX_LOAD_FACTOR = 0.6 by default
//   for (let i = 0; i < 62; i++) m.set(`k-${i + 1}`, i + 1);

//   // 1..62
//   for (let i = 0; i < 62; i++) console.log(m.get(`k-${i + 1}`));

//   m.debugBuckets("after adding");
// }

// {
//   // Overwriting value
//   const m = new HashMap(hashFn);

//   m.set("key1", "foo");
//   console.log(m.get("key1")); // foo

//   m.set("key1", "bar");
//   console.log(m.get("key1")); // bar

//   console.log(m.length);
// }

// {
//   // Iterators
//   const m = new HashMap(hashFn);

//   for (let i = 0; i < 100; i++) m.set(`k-${i + 1}`, i + 1);

//   console.log([...m.values()]); // 1..100
//   console.log(m.length); // 100

//   console.log([...m.keys()]);

//   console.log(...m.entries());
// }
