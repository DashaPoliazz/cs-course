"use strict";

const rand = require("./rand.js");

{
  const n1 = rand(0, 10).next().value;
  const n2 = rand(10, 100).next().value;
  const n3 = rand(100, 1000).next().value;
  const n4 = rand().next().value;

  console.log(n1, n2, n3, n4);
}
