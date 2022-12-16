// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (items) => items[getRandomInteger(0, items.length - 1)];

const getMultipleRandomArrayElements = (items, min, max) => items
  .slice()
  .sort(() => 0.5 - Math.random())
  .slice(0, getRandomInteger(min, max));

export { getRandomArrayElement, getMultipleRandomArrayElements, getRandomInteger };
