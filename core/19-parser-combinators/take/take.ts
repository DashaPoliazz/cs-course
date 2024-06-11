import { Parser, ParserResult, ParserToken, ParserValue } from "../types";
import intoIterable from "../helpers/intoIterable";

type PatternFn = (char: string) => boolean;
type PatternRegExp = RegExp;
type Pattern = PatternFn | PatternRegExp;

const isRegExpPattern = (pattern: Pattern): pattern is PatternRegExp =>
  typeof pattern !== "function";

type Options = {
  min: number;
  max: number;
};

const DEFAULT_OPTIONS: Options = {
  min: 0,
  max: Infinity,
};

const TAG_TYPE = "TAKE";

const take = (
  pattern: Pattern,
  options: Options = DEFAULT_OPTIONS,
): Parser<string, string> =>
  function* (
    text: Iterable<string>,
    prev?: ParserValue<string>,
  ): Generator<
    ParserToken<string>,
    ParserResult<string>,
    Iterable<string> | undefined
  > {
    const iter = text[Symbol.iterator]();
    let matched = "";
    let count = options.max;
    let next = iter.next();

    if (isRegExpPattern(pattern)) {
      while (!next.done && count > 0) {
        const isMatch = pattern.test(next.value);
        if (isMatch) {
          matched += next.value;
          count -= 1;
        }
        next = iter.next();
      }
      const token = { type: TAG_TYPE, value: matched };
      return [token, intoIterable(iter)];
    } else {
      while (!next.done && count > 0) {
        const isMatch = pattern(next.value);
        if (isMatch) {
          matched += next.value;
          count -= 1;
        }
        next = iter.next();
      }
    }

    const token = { type: TAG_TYPE, value: matched };
    return [token, intoIterable(iter)];
  };

export default take;
