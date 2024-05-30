# Iterators

## Table of Contents

- [Rand](#rand)
- [Take](#take)
- [Filter](#filter)
- [Enumerate](#enumerate)
- [Range](#range)
- [Seq](#seq)
- [Zip](#zip)
- [MapSeq](#mapSeq)

## Rand

The `random` function generates an infinite sequence of random numbers within the specified range using Node.js's built-in `crypto` module.

### Usage

```javascript
const n1 = rand(0, 10).next().value; // random value in range from 0 to 10 (not inclusively)
const n2 = rand(10, 100).next().value; // random value in range from 0 to 100 (not inclusively)
const n3 = rand(100, 1000).next().value; // random value in range from 100 to 1000 (not inclusively)
const n4 = rand().next().value; // random value with random range
```

## Take

Creates an iterator that yields the first `count` elements from the given iterable.

### Usage

```javascript
const iterable = [1, 2, 3, 4, 5];
const result = [...take(iterable, 3)]; // [1, 2, 3]
```

```javascript
const random = require("../01-rand/rand.js");

const randomIterable = random();
const tenRandomIntegers = [...take(randomIterable, 10)];
```

## Filter

The `filter` function creates an iterator that filters elements from the given iterable based on a predicate function.

### Usage

```javascript
const iterable = [1, 2, 3, 4, 5];
const predicate = (num) => num % 2 === 0;
const result = [...filter(iterable, predicate)]; // [2, 4]
```

```javascript
const random = require("./random.js");
const take = require("./take.js");

const LIMIT = 10;
const randomIterable = random();
const predicate = (el) => el < 30;
const filterIterable = filter(randomIterable, predicate);
const generatedElements = [...take(filterIterable, LIMIT)]; // 10 random numbers less than 30
```

## Enumerate

- Creates an iterator that yields elements of the given iterable along with their indices.

### Usage

```javascript
const fruits = ["apple", "banana", "cherry"];
const enumeratedFruits = [...enumerate(fruits)]; // [[0, 'apple'], [1, 'banana'], [2, 'cherry']]
```

## Range

The `Range` module provides an abstract class representing a range of values. It is designed to handle both numeric and string ranges with customizable inclusion settings and step values.

### Features

- **Stringified Numbers:** When provided with stringified numeric values, the `Range` class automatically determines whether to return a `NumberRange` or `StringRange` instance. This feature enhances flexibility and convenience when working with mixed data types.
- **Inclusion:** The `Range` subclasses support specifying whether the end value should be included in the range. This feature allows for creating both open and closed intervals according to specific use cases.
- **Step Value:** For iterating over the range, both `NumberRange` and `StringRange` allow customizing the step value. This feature enables finer control over the iteration process, allowing skipping elements or iterating in custom increments.

### Usage

```javascript
const { NumberRange, StringRange } = require("./Range");

// Create a numeric range from 1 to 10, excluding the end value
const numericRange = new NumberRange(1, 10, false);

// Create a string range from 'a' to 'z', including the end value, with a step of 2
const stringRange = new StringRange("a", "z", true, 2);
```

## Seq

The `seq` function combines multiple iterables into a single iterable sequence. It iterates through each input iterable in sequence, yielding elements from each until all are exhausted.

### Usage

```javascript
const iterable1 = [1, 2, 3];
const iterable2 = new Set([4, 5, 6]);
const iterable3 = "abcdef";

const combinedIterable = seq(iterable1, iterable2, iterable3);

console.log([...combinedIterable]); // Output: [1, 2, 3, 4, 5, 6, 'a', 'b', 'c', 'd', 'e', 'f']
```

## Zip

The `zip` function combines multiple iterables into a single iterable of tuples, where each tuple contains elements from corresponding positions in the input iterables. It aligns the lengths of iterables and ensures that iteration stops when the shortest iterable is exhausted.

### Usage

```javascript
const iterable1 = [1, 2, 3];
const iterable2 = ["a", "b", "c"];
const iterable3 = new Set([true, false, true]);

const zippedIterable = zip(iterable1, iterable2, iterable3);

console.log([...zippedIterable]); // Output: [[1, 'a', true], [2, 'b', false], [3, 'c', true]]
```

```javascript
const zippedIterable = zip([1], new Set([1, 2]), "abc");
console.log(...zippedIterable); // [1, 1, "a"]
```

## MapSeq

The `mapSeq` function applies a `map` function to each element of an input iterable, producing a new iterable sequence with the transformed elements. It performs the mapping sequentially, maintaining the order of elements from the original iterable.

### Usage

```javascript
const numbers = [1, 2, 3, 4, 5];
const squaredNumbers = mapSeq(numbers, (num) => num ** 2);
console.log([...squaredNumbers]); // Output: [1, 4, 9, 16, 25]
```

```javascript
const numbers = [1, 2, 3];
const mappers = [(el) => el * 2, (el) => el - 1];
const squaredNumbers = mapSeq(numbers, (num) => num ** 2);

console.log(...mapSeq(numbers, ...mappers)); // [1, 3, 5]
```
