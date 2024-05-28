// You need to write a function that takes a string template
// and a parameters object,
// and returns the result of applying the data to that template

// ```js
// Hello, Bob! Your age is 10.
// const res = format("Hello, ${user}! Your age is ${age}.", {
//   user: "Bob",
//   age: 10,
// });

const format = (str, wildcards) => {
  const regex = /\${[a-zA-z]+}/g;
  return str.replace(regex, (wildcard) => {
    const regex = /[a-zA-Z]+/;
    const key = regex.exec(wildcard)[0];
    return wildcards[key] ? wildcards[key] : "";
  });
};

console.log(
  format("Hello, ${user}! Your age is ${age}.", {
    user: "Bob",
    age: 10,
  }),
);
