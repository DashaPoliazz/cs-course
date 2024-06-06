const assert = require("node:assert");
const { it } = require("node:test");
const floatParser = require("./floatParser.js");

const iter = floatParser("hello 123 534.234 -56.78 9.0");

while (true) {
  const nxt = iter.next();
  console.log(nxt);
  if (nxt === "#") iter.next("123.34 884.00");
}

try {
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next("534.234"));
  console.log(iter.next());
} catch (e) {
  // Expect new input
  console.log(e);
  console.log(iter.next());
  console.log(iter.next());

  //   numbers.next(newString);
}

// it("should parse float numbers correctly", () => {
//   const text = "hello 123 534.234 -56.78 9.0 100. 0.001 -0.5";
//   const iter = floatParser(text);
//   assert.deepEqual([...iter], ["534.234", "-56.78", "9.0", "0.001", "-0.5"]);
// });

// it("should return an empty array when there are no float numbers", () => {
//   const text = "hello 123 456 789";
//   const iter = floatParser(text);
//   assert.deepEqual([...iter], []);
// });

// it("should parse float numbers with various formats", () => {
//   const text = "-1.0 2.345 -0.6789 0.456";
//   const iter = floatParser(text);
//   assert.deepEqual([...iter], ["-1.0", "2.345", "-0.6789", "0.456"]);
// });

// it("should parse float numbers within text", () => {
//   const text = "The values are -12.34, 56.78 and 90.12 in the list.";
//   const iter = floatParser(text);
//   assert.deepEqual([...iter], ["-12.34", "56.78", "90.12"]);
// });

// it("should return an empty array for an empty string", () => {
//   const text = "";
//   const iter = floatParser(text);
//   assert.deepEqual([...iter], []);
// });

// it("should handle multiple float numbers separated by various characters", () => {
//   const text = "value: 12.34; value: -56.78|value: 90.12";
//   const iter = floatParser(text);
//   assert.deepEqual([...iter], ["12.34", "-56.78", "90.12"]);
// });

// it("should parse float numbers correctly when there are leading/trailing spaces", () => {
//   const text = "  -12.34   56.78  90.12  ";
//   const iter = floatParser(text);
//   assert.deepEqual([...iter], ["-12.34", "56.78", "90.12"]);
// });
