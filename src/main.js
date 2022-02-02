import MainContentPresenter from './presenter/main-content-presenter.js';
import RoutePointsModel from './model/route-points-model.js';
import FilterTripPointsModel from './model/filter-trip-point-model.js';
import FilterTripPointPresenter from './presenter/filter-trip-point-presenter.js';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic MslIuwHRNfp2FapAPI';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const filterTripPointsModel = new FilterTripPointsModel();
const routePointsModel = new RoutePointsModel(new ApiService(END_POINT, AUTHORIZATION));

// :START Контейнеры
const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const addNewTripPointButton = document.querySelector('.trip-main__event-add-btn');
const sortAndContentContainer = document.querySelector('.trip-events');
// :END Контейнеры

const filterPresenter = new FilterTripPointPresenter(filterContainer, filterTripPointsModel);
const presenter = new MainContentPresenter(menuContainer, addNewTripPointButton, sortAndContentContainer, routePointsModel, filterTripPointsModel, filterPresenter);
presenter.init();

