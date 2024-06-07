# Generators!

## Table of Contents

1. [Dom-iterators](#domiterators)
   - [Ancestors](#ancestors)
   - [Descendants](#descendants)
   - [Siblings](#siblings)
2. [Float-parser](#floatparser)

## Dom-iterators

[dom-tree](DOM.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mock JSDOM</title>
  </head>
  <body>
    <div id="div1">
      <div id="div1.1">
        <div id="div1.1.1"></div>
        <div id="div1.1.2"></div>
      </div>
      <div id="div1.2">
        <div id="div1.2.1">
          <div id="div1.2.1.1"></div>
        </div>
      </div>
    </div>
    <div id="div2"></div>
  </body>
</html>
```

### Ancestors

The ancestors generator function iterates over all the ancestor nodes of a given DOM node, stopping at the <body> tag. It starts from the parent node of the provided DOM node and moves up the DOM tree, yielding each ancestor node until it reaches the <body> tag or the top of the tree.

```javascript
// const Ancestors = require("iteratorApproach.js");
const Ancestors = require("generatorApproach.js");

const body = dom.window.document.getElementsByTagName("body")[0];
const ancestors = Ancestors.new(body);
console.log([...ancestors].map((domNode) => domNode.id)); // [ 'div1.1', 'div1' ]
```

### Descendants

The Preorder class provides an iterator that performs a pre-order traversal of the DOM tree, starting from a given DOM node. It can be used as a generator or with the iterator protocol.

```javascript
// const Descendants = require("iteratorApproach.js");
const Descendants = require("generatorApproach.js");

const body = dom.window.document.getElementsByTagName("body")[0];
const descendants = Descendants.new(body);
console.log([...descendants].map((domNode) => domNode.id)); // "[div1", "div1.1", "div1.1.1", "div1.1.2", "div1.2", "div1.2.1", "div1.2.1.1", "div2"]
```

### Siblings

The siblings generator function iterates over all sibling nodes of a given DOM node, excluding the node itself. It starts by finding the parent node and then yields each child of the parent node that is not the original DOM node.

```javascript
// const Siblings = require("iteratorApproach.js");
const Siblings = require("generatorApproach.js");

const body = dom.window.document.getElementById("div1");
const sibilngs = Siblings(body);
console.log([...sibilngs].map((domNode) => domNode.id)); // ["div2"]
```

## Float-parser

FloatParser is a class designed to parse floating-point numbers from a given text. It supports parsing both the initial text and additional text inputs provided during iteration. This makes it useful for scenarios where text data is streamed or appended incrementally.

When the text has been consumed the iterator yield special symbol "\_".

### Basic usages:

```javascript
const parser = FloatParser.Parse(
  "hello 123 534.234 -56.78 9.0 100. 0.001 -0.5",
);
const iter = parser.iter();

console.log(iter.next().value); // "534.234"
console.log(iter.next().value); // "-56.78"
console.log(iter.next().value); // "9.0"
console.log(iter.next().value); // "100."
console.log(iter.next().value); // "0.001"
console.log(iter.next().value); // "-0.5"
console.log(iter.next().value); // "_"

iter.next("and 3.14 more text");
console.log(iter.next().value); // "3.14"
console.log(iter.next().value); // "_"
```

### Handling new text inputs:

```javascript
const parser = FloatParser.Parse("start 1.23");
const iter = parser.iter();

console.log(iter.next().value); // "1.23"
console.log(iter.next().value); // "_"

iter.next("additional 4.56 input");
console.log(iter.next().value); // "4.56"
console.log(iter.next().value); // "_"
```
