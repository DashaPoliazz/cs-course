interface ParserToken<T = unknown> {
  type: string;
  value?: T;
}

interface ParserValue<T = unknown> extends ParserToken<T> {}

type ParserResult<T = unknown> = [ParserValue<T>, Iterable<string>];

type Parser<T = unknown, R = unknown> = (
  iterable: Iterable<string>,
  prev?: ParserValue<T>,
) => Generator<ParserToken<T>, ParserResult<R>, Iterable<string> | undefined>;

export { ParserToken, ParserValue, ParserResult, Parser };
