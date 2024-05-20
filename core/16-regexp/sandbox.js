// Character classes:
// [abc] => a | b | c
// [^abc] => !a || !b || !c
// \d => same that [0-9]
// \D => not \d
// ^ => char of negation (should be always inside square braces)
// . => any single char except of line-terminators
// \w => any alphanumeric (latin) (\[a-zA-z0-9]\);
// \W => not \w
// \s => any unicode spaces
// \S => not \s
// \ => экранирование символа
// | => conjunction

// Assertions
// ^ => start of the string (the following pattern must match at beginning of string)
// $ => the pattern should be met from the end of string
// \b => '\bhello\bworld\b' matches the word boundaries
// \B => non-word-boundary

// Lookahead assertions
// x(?=y) => match x only if 'x' is followed by 'y'
// x(?!y) => match x only if 'x' is not followed y 'y'
// (?<=y)x => match

// Quantifiers
// x* => zero or more occerencies
// x+ => one or more occurencies
// ? =>

const str = "762120,0,22;763827,0,50;750842,0,36;749909,0,95;755884,0,41;";
const myRegExp = /(?<=^|;)(\d)+/g;
const res = str.split(myRegExp);

console.log("MATCH", str.match(myRegExp));
console.log("SPLITTED", res);
console.log(myRegExp.exec(str));
// ['762120', '763827', '750842', '749909', '755884']
