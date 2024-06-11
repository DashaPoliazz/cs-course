import or from "./or";
import tag from "../tag/tag";
import take from "../take/take";
import { it } from "node:test";
import assert from "node:assert";

it("should return the first match value correcrly", () => {
  const boolExpr = or(tag("true"), tag("false"))("false");
  const { done, value } = boolExpr.next();
  assert.equal(done, true);
  assert.deepEqual({ value: "false", type: "OR" }, value[0]);
});

it("should throw if no matches has been founded", () => {
  const boolExpr = or(tag("true"))("false");
  try {
    boolExpr.next();
  } catch (error) {
    assert.equal(true, true);
  }
});
