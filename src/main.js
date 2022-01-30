import MainContentPresenter from './presenter/main-content-presenter.js';
import RoutePointsModel from './model/route-points-model.js';
import FilterTripPointsModel from './model/filter-trip-point-model.js';
import FilterTripPointPresenter from './presenter/filter-trip-point-presenter.js';

import {getRoutePoint} from './mock/get-route-point.js';

// mock
const TRIP_POINT_COUNT = 20;
const tripPoints = Array.from({length: TRIP_POINT_COUNT}, getRoutePoint);
// mock

const filterTripPointsModel = new FilterTripPointsModel();
const routePointsModel = new RoutePointsModel();
routePointsModel.routePoints = tripPoints;

// :START Контейнеры
const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const addNewTripPointButton = document.querySelector('.trip-main__event-add-btn');
const sortAndContentContainer = document.querySelector('.trip-events');
// :END Контейнеры

const filterPresenter = new FilterTripPointPresenter(filterContainer, filterTripPointsModel, routePointsModel);
const presenter = new MainContentPresenter(menuContainer, addNewTripPointButton, sortAndContentContainer, routePointsModel, filterTripPointsModel);
presenter.init();
filterPresenter.init();


