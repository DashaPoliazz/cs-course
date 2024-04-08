General Flow of Creating Structs and Tuples:

1. Defining a scheme.

At this stage, nothing specific happens. There is no initialization at all.

```
const Father = new Struct({
    firstName: Struct.String("ASCII", 5),
    lastName: Struct.String("ASCII", 3),
    age: Struct.U8,
});
```

2. Creating a Abstract Data Type (either Struct or Tuple).

Everything happens while creating the Abstract Data Type. The flow of creating a struct:

2.1 Creating a Shape.

Shape is a tree-like structure where each node has its key. If we are creating a Struct, then each key is a default string, but if it's a Tuple, then each key is an index. The goal of the shape is to create one contract that will come in handy later.

Each shape node's value is an array<[bitsLength, TypedArray, encodeDecodeFns, length]>.

- `bitsLength`: describes the total bits length needed to allocate data.
- `TypedArray`: typed array that will be created on initialization.
- `encodeDecodeFns`: Object that contains two functions: `encode` (takes a string and returns an array of its codes) and `decode` (takes an array of codes and converts it into an array of chars). It's an optional parameter and exists only if the value has been specified as a string.
- `length`: length of chars in the strings. It exists only if the value has been specified as a string.

**Shape of a Struct:**

```js
  {
   firstName: [
     40,
     [Function: Uint8Array],
     { encode: [Function: encode], decode: [Function: decode] },
     5
   ],
   lastName: [
     24,
     [Function: Uint8Array],
     { encode: [Function: encode], decode: [Function: decode] },
     3
   ],
   age: [ 8, [Function: Uint8Array] ]
 }
```

**Shape of a Tuple:**

```js
const Color = new Tuple(Struct.U8, Struct.U8, Struct.U8);
```

```jsx
{
'0': [ 8, [Function: Uint8Array] ],
'1': [ 8, [Function: Uint8Array] ],
'2': [ 8, [Function: Uint8Array] ]
}
```

2.2. Creating Markup based on the Shape

Markup's goal is to define offsets.

**Tuple Markup:**

```
const Color = new Tuple(Struct.U8, Struct.U8, Struct.U8);
```

Tuple markup:

```
{
'0': { byteOffset: 0, TypedArray: [Function: Uint8Array], byteLength: 1 },
'1': { byteOffset: 1, TypedArray: [Function: Uint8Array], byteLength: 1 },
'2': { byteOffset: 2, TypedArray: [Function: Uint8Array], byteLength: 1 }
}
```

**Struct Markup:**

```
new Struct({
    firstName: Struct.String("ASCII", 4),
    lastName: Struct.String("ASCII", 3),
    age: Struct.U8,
  });
```

Struct markup:

```
{
	firstName: {
	  byteOffset: 0,
	  TypedArray: [Function: Uint8Array],
	  byteLength: 1,
	  encodeDecode: { encode: [Function: encode], decode: [Function: decode] },
	  length: 4
	},
	lastName: {
	  byteOffset: 4,
	  TypedArray: [Function: Uint8Array],
	  byteLength: 1,
	  encodeDecode: { encode: [Function: encode], decode: [Function: decode] },
	  length: 3
	},
	age: { byteOffset: 7, TypedArray: [Function: Uint8Array], byteLength: 1 }
}
```

I've decided not to measure offsets on creating shape to keep code cleaner.

2.3. Initialize buffer and DataView for buffer.

2.4. Initialize getAndSet

Since only TypedArray is present in the markup, to perform read/write operations, we have to create getters and setters from DataView API and bind them to the context of DataView.

2.5. Initalize getters and setters for read/write operations

The goal of this step is to provide the ability to read and write data by its terminal keys.

For example, if we have a Struct:

```js
const Child = new Struct({
  firstName: Struct.String("ASCII", 4),
  lastName: Struct.String("ASCII", 3),
  age: Struct.U8,
  favoriteColor: Color,
});

const Family = new Struct({
  mother: Mother,
  father: Father,
  child: Child,
});
```

To access keys such as "child.favoriteColor.0", we have to create getters and setters for each key.
