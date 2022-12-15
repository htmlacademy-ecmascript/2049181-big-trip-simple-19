import {
  getMultipleRandomArrayElements,
  getRandomArrayElement,
  getRandomInteger
} from './utils.js';
import { MAX_PICTURES, descriptions, cities } from './const.js';

const generatePicture = () => ({
  src: `https://loremflickr.com/248/152?random=${getRandomInteger(100, 500)}`,
  description: getRandomArrayElement(descriptions)
});

const generateDescription = () => getMultipleRandomArrayElements(descriptions, 1, 3)
  .join(' ');

const generatePictures = () => Array.from(
  { length: getRandomInteger(1, MAX_PICTURES) },
  generatePicture
);

const generateDestinationName = () => getRandomArrayElement(cities);

const generateDestination = (id) => ({

  id: id,
  description: generateDescription(),
  name: generateDestinationName(),
  pictures: generatePictures()
});

const destinations = [];

for (let i = 1; i <= cities.length; i++) {
  const destination = generateDestination(i);
  destinations.push(destination);
}

export { destinations };
