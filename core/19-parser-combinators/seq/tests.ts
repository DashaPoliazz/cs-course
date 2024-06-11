import seq from "./seq";
import tag from "../tag/tag";
import take from "../take/take";
import { it } from "node:test";
import assert from "node:assert";

it("should take the whole string", () => {
  const fnExpr = seq(
    tag("function "),
    take(/[a-z_$]/i, { max: 3, min: 0 }),
    tag("()"),
  )("function foo() {}");

  const { value, done } = fnExpr.next();
  assert.equal(done, true);
  assert.deepEqual(value[0], { type: "SEQ", value: "function foo()" });
});

it("should correcrly work with take", () => {
  const s = seq(
    take(/\d/, {
      max: 3,
      min: 0,
    }),
    tag(","),
  )("100,200,300,");
});
