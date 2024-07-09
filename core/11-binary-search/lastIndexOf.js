const lastIndexOf = (arr, cb) => {
  let left = 0;
  let right = arr.length;
  let f = false;

  while (left < right) {
    const middle = Math.floor((right - left) / 2 + left);
    const cbRes = cb(arr[middle]);

    if (cbRes === 0) f = true;
    if (cbRes <= 0) left = middle + 1;
    else right = middle;
  }

  return f ? left - 1 : -1;
};

// usages:
{
  const arr = [
    { age: 12, name: "Bob" },
    { age: 42, name: "Ben" },
    { age: 42, name: "Jack" },
    { age: 42, name: "Sam" },
    { age: 56, name: "Bill" },
  ];

  console.log(lastIndexOf(arr, ({ age }) => age - 42));
}

{
  const arr = [
    { age: 42, name: "Bob" },
    { age: 52, name: "Ben" },
    { age: 62, name: "Jack" },
    { age: 72, name: "Sam" },
    { age: 86, name: "Bill" },
  ];

  console.log(lastIndexOf(arr, ({ age }) => age - 42));
}

{
  const arr = [
    { age: 0, name: "Bob" },
    { age: 1, name: "Ben" },
    { age: 2, name: "Jack" },
    { age: 3, name: "Sam" },
    { age: 42, name: "Bill" },
  ];

  console.log(lastIndexOf(arr, ({ age }) => age - 42));
}
