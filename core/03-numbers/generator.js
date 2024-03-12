function* iter(start = 0n, end = 15n, step = 1n) {
  for (let i = start; i <= end; i += step) {
    let message = "";

    if (i !== 0n && i % 3n === 0n && i % 5n === 0n) message = "fizzbuzz";
    else if (i !== 0n && i % 3n === 0n) message = "fizz";
    else if (i !== 0n && i % 5n === 0n) message = "buzz";

    if (message !== "") console.log(`[${i}] - [${message}]`);

    yield i;
  }
}

module.exports = iter;
