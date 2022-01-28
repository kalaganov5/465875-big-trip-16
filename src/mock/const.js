import {nanoid} from 'nanoid';
import {getRandomInteger, getRandomDescriptions} from './utils.js';

const ROUTE_POINT_PHOTOS_COUNT = 5;

export const ROUTE_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
export const ROUTE_DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];
export const ROUTE_CITIES = ['Amsterdam', 'Chamonix', 'Geneva', 'Dublin', 'Kanpur', 'Narva'];

export const ROUTE_POINT_OFFERS = {
  'taxi': [
    {
      'id': nanoid(),
      'title': 'Switch to comfort class',
      'price': 48,
    },
    {
      'id': nanoid(),
      'title': 'Order Uber',
      'price': 16,
    },
    {
      'id': nanoid(),
      'title': 'Add meal',
      'price': 79,
    },
    {
      'id': nanoid(),
      'title': 'Choose seats',
      'price': 52,
    }
  ],
  'drive': [
    {
      'id': nanoid(),
      'title': 'Switch to comfort class',
      'price': 22,
    }
  ],
  'ship': [
    {
      'id': nanoid(),
      'title': 'Switch to comfort class',
      'price': 76,
    }
  ],
  'restaurant': [],
  'flight': [],
  'sightseeing': [
    {
      'id': nanoid(),
      'title': 'Switch to comfort class',
      'price': 42,
    },
    {
      'id': nanoid(),
      'title': 'Order Uber',
      'price': 5,
      'isSelect': true
    },
    {
      'id': nanoid(),
      'title': 'Add meal',
      'price': 40,
    },
    {
      'id': nanoid(),
      'title': 'Choose seats',
      'price': 76,
    }
  ],
  'bus': [
    {
      'id': nanoid(),
      'title': 'Switch to comfort class',
      'price': 78,
    }
  ],
  'train': [
    {
      'id': nanoid(),
      'title': 'Switch to comfort class',
      'price': 98,
    },
    {
      'id': nanoid(),
      'title': 'Order Uber',
      'price': 63,
    },
    {
      'id': nanoid(),
      'title': 'Add meal',
      'price': 36,
    },
    {
      'id': nanoid(),
      'title': 'Choose seats',
      'price': 35,
    }
  ],
  'check-in': [
    {
      'id': nanoid(),
      'title': 'Switch to comfort class',
      'price': 26,
    },
    {
      'id': nanoid(),
      'title': 'Order Uber',
      'price': 30,
    },
    {
      'id': nanoid(),
      'title': 'Add meal',
      'price': 93,
    }
  ]
};

const getRandomPhoto = () => (
  `http://picsum.photos/248/152?r=${getRandomInteger(1, 1000)}`
);

export const getRandomPhotos = () => (
  Array.from({length: getRandomInteger(0, ROUTE_POINT_PHOTOS_COUNT)}, getRandomPhoto)
);

export const ROUTES_INFO = Object.assign(
  {},...ROUTE_CITIES
    .map((city) => (
      {[city]:
        {
          photos: getRandomPhotos(),
          description: getRandomDescriptions(ROUTE_DESCRIPTION),
        }
      })
    )
);


