function solve(a) {
  const n = a.length;
  const d = new Array(n).fill(Infinity);
  d[0] = -Infinity;

  for (let i = 0; i < n; i++) {
    for (let j = 1; j <= n; j++) {
      if (d[j - 1] < a[i] && a[i] < d[j]) {
        d[j] = a[i];
      }
    }
  }

  console.log(dp);
}

solve([2, 1, 4, 5, 3]);
