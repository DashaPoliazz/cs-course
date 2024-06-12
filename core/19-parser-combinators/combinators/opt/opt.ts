import { Parser, ParserResult, ParserToken, ParserValue } from "../../types";

const TAG_TYPE = "OPT";

const opt = (parser: Parser<string, string>): Parser<string, string> =>
  function* (
    text: Iterable<string>,
    prev?: ParserValue<string>,
  ): Generator<
    ParserToken<string>,
    ParserResult<string>,
    Iterable<string> | undefined
  > {
    try {
      const { value, done } = parser(text, prev).next() as IteratorResult<
        ParserResult<string>
      >;
      const [token, nextText] = value;
      return [token, nextText];
    } catch (error) {
      const mockToken = { type: TAG_TYPE, value: "" };
      return [mockToken, text];
    }
  };

export default opt;
