import { getRandomInteger } from './utils.js';

const offersByType = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Choose music',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Smoke in the car',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Upgrade class',
        price: getRandomInteger(25, 900)
      },
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: 1,
        title: 'Choose radio',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Nice driver',
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
        title: 'A glass of tea',
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
        title: 'Extra dinner',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Personal boat',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Dinner with cap',
        price: getRandomInteger(25, 900)
      },
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: 1,
        title: 'Child seat',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'New tyres',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Full tank of gas',
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
        title: 'Swim in fontain',
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
        title: 'Climb the roof',
        price: getRandomInteger(25, 900)
      },
      {
        id: 2,
        title: 'Bar tour',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Walk around',
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
        title: 'Extra bread',
        price: getRandomInteger(25, 900)
      },
      {
        id: 3,
        title: 'Drink all',
        price: getRandomInteger(25, 900)
      }
    ]
  },
];

export { offersByType };
