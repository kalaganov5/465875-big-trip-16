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
      'title': 'Switch to comfort class',
      'price': 48,
      'isSelect': false
    },
    {
      'title': 'Order Uber',
      'price': 16,
      'isSelect': false
    },
    {
      'title': 'Add meal',
      'price': 79,
      'isSelect': false
    },
    {
      'title': 'Choose seats',
      'price': 52,
      'isSelect': false
    }
  ],
  'drive': [
    {
      'title': 'Switch to comfort class',
      'price': 22,
      'isSelect': false
    }
  ],
  'ship': [
    {
      'title': 'Switch to comfort class',
      'price': 76,
      'isSelect': false
    }
  ],
  'restaurant': [],
  'flight': [],
  'sightseeing': [
    {
      'title': 'Switch to comfort class',
      'price': 42,
      'isSelect': false
    },
    {
      'title': 'Order Uber',
      'price': 5,
      'isSelect': true
    },
    {
      'title': 'Add meal',
      'price': 40,
      'isSelect': false
    },
    {
      'title': 'Choose seats',
      'price': 76,
      'isSelect': false
    }
  ],
  'bus': [
    {
      'title': 'Switch to comfort class',
      'price': 78,
      'isSelect': false
    }
  ],
  'train': [
    {
      'title': 'Switch to comfort class',
      'price': 98,
      'isSelect': false
    },
    {
      'title': 'Order Uber',
      'price': 63,
      'isSelect': false
    },
    {
      'title': 'Add meal',
      'price': 36,
      'isSelect': false
    },
    {
      'title': 'Choose seats',
      'price': 35,
      'isSelect': false
    }
  ],
  'check-in': [
    {
      'title': 'Switch to comfort class',
      'price': 26,
      'isSelect': false
    },
    {
      'title': 'Order Uber',
      'price': 30,
      'isSelect': false
    },
    {
      'title': 'Add meal',
      'price': 93,
      'isSelect': false
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


