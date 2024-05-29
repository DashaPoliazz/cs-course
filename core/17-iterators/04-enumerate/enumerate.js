// ## Необходимо написать функцию enumerate, которая принимает
// любой Iterable объект и возвращает итератор по парам (номер итерации, элемент)

// ```js
// const randomInt = random(0, 100);

// console.log([...take(enumerate(randomInt), 3)]); // [[0, ...], [1, ...], [2, ...]]
// ```

function enumerate(iterable) {
  return {
    [Symbol.iterator]() {
      let idx = 0;
      let iter = iterable[Symbol.iterator]();

      return {
        next: () => {
          const { done, value } = iter.next();
          if (done) return { done, value };
          return { done: false, value: [idx++, value] };
        },
      };
    },
  };
}

module.exports = enumerate;
