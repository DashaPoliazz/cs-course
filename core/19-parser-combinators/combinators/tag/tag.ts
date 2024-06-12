import { Parser, ParserResult, ParserToken, ParserValue } from "../../types";
import ParseError from "../../ParseError/ParseError";
import intoIterable from "../../helpers/intoIterable";

const TAG_TYPE = "TAG";

const tag = (pattern: string): Parser<string, string> =>
  function* (
    text: Iterable<string>,
    prev?: ParserValue<string>,
  ): Generator<
    ParserToken<string>,
    ParserResult<string>,
    Iterable<string> | undefined
  > {
    const iter = text[Symbol.iterator]();
    for (const char of pattern) {
      const iterator = iter.next();
      // Checking for parse-error
      if (iterator.done || iterator.value !== char) {
        throw new ParseError(
          `Expected ${char} but receieved ${iterator.value}`,
        );
      }
    }

    const token = { type: TAG_TYPE, value: pattern };
    const iterable = intoIterable(iter);

    return [token, iterable];
  };

export default tag;
