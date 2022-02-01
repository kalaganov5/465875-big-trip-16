export const DAY_OF_MINUTES = 1440;
export const HOUR_OF_MINUTES = 60;

export const UserAction = {
  UPDATE_ROUTE_POINT: 'UPDATE_ROUTE_POINT',
  ADD_ROUTE_POINT: 'ADD_ROUTE_POINT',
  DELETE_ROUTE_POINT: 'DELETE_ROUTE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  LOAD_ERROR: 'LOAD_ERROR'
};

export const SortType = {
  DEFAULT: 'sort-day',
  PRICE: 'sort-price',
  TIME: 'sort-time',
};

export const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PAST: 'PAST',
};

export const MenuItem = {
  TRIP_POINTS: 'TRIP_POINTS',
  STATISTICS: 'STATISTICS',
};

export const LoadStatus = {
  LOADING: 'LOADING',
  LOADED: 'LOADED',
};
