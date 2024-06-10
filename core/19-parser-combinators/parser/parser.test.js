const { it, describe } = require("node:test");
const Parser = require("./Parser.ts");

it("should work!", () => {
  console.log("work");
  const parser = new Parser("string");
  console.log(parser);
});
