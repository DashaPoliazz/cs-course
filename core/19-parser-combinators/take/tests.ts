import take from "./take";
import { it } from "node:test";
import assert from "node:assert";
import { ParserResult } from "../types.js";

it("should works!", () => {
  const takeNumber = take(/\d/)("1234 foo");
  console.log(takeNumber.next()); // {done: true, value: {type: 'TAKE', value: '1234'}}
  const takeNumber2 = take(/\d/, { max: 2, min: 0 })("1234 foo");
  console.log(takeNumber2.next()); // {done: true, value: {type: 'TAKE', value: '12'}}
});
