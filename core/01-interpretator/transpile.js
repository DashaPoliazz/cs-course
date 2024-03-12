"use strict";

const fs = require("node:fs");

const commandsMapper = (command) => {
  if (command === "ADD") return "+";
  else if (command === "SUB") return "-";
  else if (command === "MUL") return "*";
  else if (command === "DIV") return "/";
  else return "+";
};

const transpileFn = (tokens) => {
  const body = tokens.slice(1);

  const transpiledSignature = `const result = stack.pop() ${commandsMapper(
    body[0][0],
  )} stack.pop(); console.log(result)`;

  return transpiledSignature;
};

const transpile = async (tokens, transpilingPath) => {
  let i = 0;

  let output = "";

  while (i < tokens.length) {
    const [command, value] = tokens[i];

    if (command === "PUSH") {
      const transpiledCode = `stack.push(${value})`;
      output = output.concat(`${transpiledCode};`);
    } else if (command === "POP") {
      const transpiledCode = `stack.pop(${value})`;
      output = output.concat(`${transpiledCode};`);
    } else if (command === "FN") {
      const functionTokens = [];
      while (i < tokens.length && tokens[i][0] !== "ret") {
        functionTokens.push(tokens[i++]);
      }
      const transpiledCode = transpileFn(functionTokens);
      output = output.concat(`${transpiledCode};`);
    } else if (command === "MOV") {
      const transpiledCode = `heap.insert(${value})`;
      output = output.concat(`${transpiledCode};`);
    } else if (command === "GET") {
      const transpiledCode = `heap.delete()`;
      output = output.concat(`${transpiledCode};`);
    }

    i++;
  }

  fs.writeFile(transpilingPath, output, (err) => {
    if (err) console.log("Unable to write file:", output);
  });
};

module.exports = transpile;
