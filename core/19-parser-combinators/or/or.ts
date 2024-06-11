import { Parser, ParserResult, ParserToken, ParserValue } from "../types";
import intoIterable from "../helpers/intoIterable";
import ParseError from "../ParseError/ParseError";

const TAG_TYPE = "OR";

const or = (...parsers: Parser<string, string>[]): Parser<string, string> =>
  function* (
    text: Iterable<string>,
    prev?: ParserValue<string>,
  ): Generator<
    ParserToken<string>,
    ParserResult<string>,
    Iterable<string> | undefined
  > {
    for (const parser of parsers) {
      try {
        const { value, done } = parser(text, prev).next() as IteratorResult<
          ParserResult<string>
        >;
        const [token, nextIterable] = value;
        return [
          { value: token.value, type: TAG_TYPE },
          intoIterable(nextIterable),
        ];
      } catch (error) {}
    }

    throw new ParseError("There is no matches has been founded");
  };

export default or;
