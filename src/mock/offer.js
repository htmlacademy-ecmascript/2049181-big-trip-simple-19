import { getRandomInteger } from './utils.js';

const offersByType = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Choose the radio station',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Smoke in the car',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Upgrade car comfort class',
        price: getRandomInteger(25, 900)
      },
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: 1,
        title: 'Choose the radio station',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Smoke in the bus',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Bus with toilet',
        price: getRandomInteger(25, 900)
      },
    ]
  },
  {
    type: 'train',
    offers: [
      {
        id: 1,
        title: 'Place not near the toilet',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Clean bed linen',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Single coupe',
        price: getRandomInteger(25, 900)
      },
    ]
  },
  {
    type: 'ship',
    offers: [
      {
        id: 1,
        title: 'Extra pills for motion sickness',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Personal life buoy',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Dinner with the captain',
        price: getRandomInteger(25, 900)
      },
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: 1,
        title: 'New air freshener',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Radio tape recorder',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Full tank of gasoline',
        price: getRandomInteger(25, 900)
      },
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 1,
        title: 'Window seat',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Improve class',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Sit in the cockpit',
        price: getRandomInteger(25, 900)
      },
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 1,
        title: 'Roof pass',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Swim in the middle of the lake',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Drink coffee',
        price: getRandomInteger(25, 900)
      },
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: 1,
        title: 'Climb the highest tower',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Bar tour',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Walk around the local markets',
        price: getRandomInteger(25, 900)
      },
    ]
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: 1,
        title: 'Order fried nails',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Slap the waitress on the ass',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Drink until you burst',
        price: getRandomInteger(25, 900)
      }
    ]
  },
];

export {offersByType};
