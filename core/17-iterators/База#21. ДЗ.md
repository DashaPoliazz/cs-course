# ДЗ к лекции База#21

## Необходимо написать итератор для генерации случайных чисел по заданным параметрам

```js
const randomInt = random(0, 100);

console.log(randomInt.next());
console.log(randomInt.next());
console.log(randomInt.next());
console.log(randomInt.next());
```

## Необходимо написать функцию take, которая принимает любой Iterable объект и возвращает итератор по заданному количеству его элементов

```js
const randomInt = random(0, 100);

console.log([...take(randomInt, 15)]);
```

## Необходимо написать функцию filter, которая принимает любой Iterable объект и функцию-предикат. И возвращает итератор по элементам которые удовлетворяют предикату.

```js
const randomInt = random(0, 100);

console.log([...take(filter(randomInt, (el) => el > 30), 15)]);
```

## Необходимо написать функцию enumerate, которая принимает любой Iterable объект и возвращает итератор по парам (номер итерации, элемент)

```js
const randomInt = random(0, 100);

console.log([...take(enumerate(randomInt), 3)]); // [[0, ...], [1, ...], [2, ...]]
```

## Необходимо написать класс Range, который бы позволял создавать диапазоны чисел или символов, а также позволял обходить элементы Range с любого конца

```js
const symbolRange = new Range('a', 'f');

console.log(Array.from(symbolRange)); // ['a', 'b', 'c', 'd', 'e', 'f']

const numberRange = new Range(-5, 1);

console.log(Array.from(numberRange.reverse())); // [1, 0, -1, -2, -3, -4, -5]
```

## Необходимо написать функцию seq, которая бы принимала множество Iterable объектов и возвращала итератор по их элементам

```js
console.log(...seq([1, 2], new Set([3, 4]), 'bla')); // 1, 2, 3, 4, 'b', 'l', 'a'
```

## Необходимо написать функцию zip, которая бы принимала множество Iterable объектов и возвращала итератор по кортежам их элементов

```js
console.log(...zip([1, 2], new Set([3, 4]), 'bl')); // [[1, 3, b], [2, 4, 'l']]
```

## Необходимо написать функцию, которая принимала бы любой Iterable объект и Iterable с функциями и возвращала итератор где каждому элементу левого Iterable последовательно применяются все функции из правого

```js
console.log(...mapSeq([1, 2, 3], [(el) => el * 2, (el) => el - 1])); // [1, 3, 5]
```
