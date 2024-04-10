const obj = { key1: "value1", key2: "value2" };

// Преобразуем объект в JSON-строку
const jsonString = JSON.stringify(obj);

// Преобразуем JSON-строку в байты (в кодировке UTF-8)
const utf8Bytes = new TextEncoder().encode(jsonString);

console.log(utf8Bytes); // Выведет массив байтов, представляющий объект в кодировке UTF-8
console.log(JSON.parse(jsonString));
