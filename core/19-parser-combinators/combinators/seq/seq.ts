import { Parser, ParserResult, ParserToken, ParserValue } from "../../types";
import intoIterable from "../../helpers/intoIterable";

const TAG_TYPE = "SEQ";

const seq = (...parsers: Parser<string, string>[]): Parser<string, string> =>
  function* (
    text: Iterable<string>,
    prev?: ParserValue<string>,
  ): Generator<
    ParserToken<string>,
    ParserResult<string>,
    Iterable<string> | undefined
  > {
    let matched = [];
    let iterable = text;

    for (const parser of parsers) {
      const { value, done } = parser(iterable).next() as IteratorResult<
        ParserResult<string>
      >;
      const [token, nextIterable] = value;
      iterable = nextIterable;

      matched.push(token.value);
    }

    const token = { type: TAG_TYPE, value: matched.join("") };
    return [token, iterable];
  };

export default seq;
