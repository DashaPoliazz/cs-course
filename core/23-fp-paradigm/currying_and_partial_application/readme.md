# High order functions

Parser combinators are powerful tools in functional programming that allow for the composition of small, reusable parsers to create more complex parsers. This project provides a set of combinators for building parsers in a modular and declarative way.

## Table of Contents

- [Partial Application](#partialapplication)
- [Curry](#curry)
- [Skip Curry](#skipcurry)
- [Compose](#compose)

## Partial Application

The partial application function allows you to fix a number of arguments to a function, producing a new function of smaller arity.

### Usages

```javascript
const partialAdd = partial(add, 1);
const result = partialAdd(2, 3);
console.log(result); // 6
```

## Curry

The curry function transforms a function of multiple arguments into a series of functions that each take a single argument.

### Usages

```javascript
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
```

## Skip Curry

The skip curry function allows currying of a function while skipping arguments using placeholders. It's important to note the following rules:

- It's not possible to skip more than **curriedFn.length arguments**. For instance, you cannot skip an argument at a **position >= curriedFn.length**.
- It's allowed to curry your function **fnToCurry.length \* 2** times. Currying more than this contradicts the rule of allowed skips.

### Incorrect usage

```javascript
const add = (a, b, c, d, e) => a + b + c + d + e; // => 5 args
//      1, 2,  3,  4, 5,  6 (It's forbidden to skip argument on position 6)
c(add)(c._)(2)(1)(c._)(4)(c._)(3)(5); // Error: There is only possible to skip 5 arguments. Trying to skip 6.
```

### Correct usage

```javascript
//    add = _ , _, _, _, _
const add = (a, b, c, d, e) => a + b + c + d + e;
//    add = 1, _, 2, _, 3
const curriedAdd = c(add)(1)(c._)(2)(c._)(3);
//    add = 1, 4, 2, 5, 3
console.log(curriedAdd(4)(5)); // 15
```

## Compose

The compose function allows you to combine multiple functions into a single function, where each function consumes the result of the function that follows.

### Usages

```javascript
const f = compose(
  (a) => a ** 2,
  (a) => a * 10,
  (a) => Math.sqrt(a),
);

const result = f(16);
console.log(result); // 1600
```
