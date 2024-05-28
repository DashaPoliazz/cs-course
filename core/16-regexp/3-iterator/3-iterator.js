// Iterator based on a string
// It is necessary to create an iterator based on the original string.

// [['"a": 1', 'a', '1'], ['"b": "2"', 'b', '"2"']]
// [...'{"a": 1, "b": "2"}'.matchAll(myRegExp)];

module.exports = (str) => {
  const regex = /"([a-zA-Z]+)"\s*:\s*("[^"]*"|\d+)/g;
  return str.matchAll(regex);
};
