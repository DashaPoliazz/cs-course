const parse = (input) => {
  const regex = /\(([^()]+)\)\s*\*\*\s*\d+|\d+\s*[\+\-\*/]\s*\d+/g;

  return input.replace(regex, (match) => {
    const sanitizedMatch = match.replace(/\s+/g, "");
    const result = eval(sanitizedMatch);

    return result;
  });
};

const input = `
Some text (10 + 15 - 24) ** 2
Some other text 2 * 10
`;

console.log(parse(input));

module.exports = parse;
