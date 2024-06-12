import repeat from "./repeat";
import tag from "../tag/tag";
import take from "../take/take";
import { it } from "node:test";
import assert from "node:assert";
import seq from "../seq/seq";

it("should return the first match value correcrly", () => {
  const takeNumbers = repeat(
    seq(
      take(/\d/, {
        min: 0,
        max: 3,
      }),
      tag(","),
    ),
    { max: 3, min: 0 },
  )("100,200,300,");

  assert.deepEqual(takeNumbers.next(), {
    value: { type: "SEQ", value: "100," },
    done: false,
  });
  assert.deepEqual(takeNumbers.next(), {
    value: { type: "SEQ", value: "200," },
    done: false,
  });
  assert.deepEqual(takeNumbers.next(), {
    value: { type: "SEQ", value: "300," },
    done: false,
  });
  const next = takeNumbers.next();
  assert.deepEqual(next.value[0], {
    type: "REPEAT",
    value: "100,200,300,",
  });
});
