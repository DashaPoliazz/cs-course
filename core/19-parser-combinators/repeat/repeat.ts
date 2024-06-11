import { Parser, ParserResult, ParserToken, ParserValue } from "../types";

type Options = {
  min: number;
  max: number;
};

const DEFAULT_OPTIONS: Options = {
  min: 0,
  max: 1,
};

const TAG_TYPE = "REPEAT";

const repeat = (
  parser: Parser<string, string>,
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
    let count = 0;
    const result = [];

    while (count < options.max) {
      const { done, value } = parser(text).next() as IteratorResult<
        ParserResult<string>
      >;
      const [token, next] = value;
      result.push(token.value);
      yield token;
      text = next;
      count += 1;
    }

    const token = { type: TAG_TYPE, value: result.join("") };
    return [token, text];
  };

export default repeat;
