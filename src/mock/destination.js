import {
  getMultipleRandomArrayElements,
  getRandomInteger
} from './utils.js';
import {
  MAX_PICTURES,
  descriptions,
  cities
} from './const.js';

const generatePicture = () => ({
  src: `https://loremflickr.com/248/152?random=${getRandomInteger(100, 500)}`,
  description: 'Picture nice description'
});

const generateDescription = () => getMultipleRandomArrayElements(descriptions, 1, 3)
  .join(' ');

const generatePictures = () => Array.from(
  { length: getRandomInteger(1, MAX_PICTURES) },
  generatePicture
);

const generateDestination = (name,id) => ({

  id,
  description: generateDescription(),
  name,
  pictures: generatePictures()
});

const destinations = [];

cities
  .slice()
  .sort(() => 0.5 - Math.random())
  .forEach((city, id) => destinations.push(generateDestination(city, id)));

export { destinations };
