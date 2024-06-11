import opt from "./opt";
import tag from "../tag/tag";
import take from "../take/take";
import { it } from "node:test";
import assert from "node:assert";
import repeat from "../repeat/repeat";
import seq from "../seq/seq";

it("should optionally return tag", () => {
  const takeNumbers = seq(
    take(/\d/, { min: 0, max: 3 }),
    opt(tag(",")),
  )("100,200,300");
  //   const takeNumbers = seq(
  //     take(/\d/, { min: 0, max: 3 }),
  //     opt(tag(",")),
  //   )("100,200,300");

  console.log(takeNumbers.next()); // {done: false, value: {type: 'SEQ', value: '100,'}}
  console.log(takeNumbers.next()); // {done: false, value: {type: 'SEQ', value: '200,'}}
  console.log(takeNumbers.next()); // {done: false, value: {type: 'SEQ', value: '300'}}
});

// it("should return the first match value correcrly", () => {
//   const takeNumbers = repeat(
//     seq(take(/\d/, { min: 0, max: 3 }), opt(tag(","))),
//     {
//       max: 1,
//       min: 0,
//     },
//   )("100,200,300");
//   //   const takeNumbers = seq(
//   //     take(/\d/, { min: 0, max: 3 }),
//   //     opt(tag(",")),
//   //   )("100,200,300");

//   console.log(takeNumbers.next()); // {done: false, value: {type: 'SEQ', value: '100,'}}
//   console.log(takeNumbers.next()); // {done: false, value: {type: 'SEQ', value: '200,'}}
//   console.log(takeNumbers.next()); // {done: false, value: {type: 'SEQ', value: '300'}}
// });
