import tag from "./tag.ts";
import { it } from "node:test";
import assert from "node:assert";
import { ParserResult } from "../types.js";
// npx ts-node-dev --respawn --transpile-only src/index.ts

it("should return correct token", () => {
  const fnTag = tag("function")("function foo() {}");

  const [token, iter] = fnTag.next().value as ParserResult<string>;
  assert.deepEqual(token, { type: "TAG", value: "function" });
});
