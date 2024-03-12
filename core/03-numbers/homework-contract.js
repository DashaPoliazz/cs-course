function* iter(start = 1n, end = 15n, step = 1n) {
  for (let i = start; i <= end; i += step) {
    if (i !== 0n && i % 3n === 0n && i % 5n === 0n) yield "fizzbuzz";
    else if (i !== 0n && i % 3n === 0n) yield "fizz";
    else if (i !== 0n && i % 5n === 0n) yield "buzz";
    else yield i;
  }
}

module.exports = iter;
