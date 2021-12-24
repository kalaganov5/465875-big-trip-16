import TripPointsPresenter from './presenter/trip-points-presenter.js';
import {getRoutePoint} from './mock/get-route-point.js';

const TRIP_POINT_COUNT = 20;
const tripPoints = Array.from({length: TRIP_POINT_COUNT}, getRoutePoint);

// :START Контейнеры
const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const sortAndContentContainer = document.querySelector('.trip-events');
// :END Контейнеры

const presenter = new TripPointsPresenter(menuContainer, filterContainer, sortAndContentContainer);
presenter.init(tripPoints);
