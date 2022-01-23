import MainContentPresenter from './presenter/main-content-presenter.js';
import RoutePointsModel from './model/route-points-model.js';
import {getRoutePoint} from './mock/get-route-point.js';
import {sortDayAscending} from './utils/common.js';

const TRIP_POINT_COUNT = 20;
const tripPoints = Array.from({length: TRIP_POINT_COUNT}, getRoutePoint);
tripPoints.sort(sortDayAscending);

const routePointsModel = new RoutePointsModel();
routePointsModel.routePoints = tripPoints;

// :START Контейнеры
const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const sortAndContentContainer = document.querySelector('.trip-events');
// :END Контейнеры

const presenter = new MainContentPresenter(menuContainer, filterContainer, sortAndContentContainer, routePointsModel);
presenter.init();
