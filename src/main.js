import {RenderPosition, renderTemplate} from './render.js';
import {createMenuTemplate} from './view/menu-view.js';
import {createFilterTemplate} from './view/filters-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createTripPointListTemplate, createTripPointItemTemplate} from './view/trip-point-item-view.js';
import {createFormPointTemplate} from './view/form-trip-point-view.js';
import {getRoutePoint} from './mock/get-route-point.js';

const TRIP_POINT_COUNT = 20;
const tripPoints = Array.from({length: TRIP_POINT_COUNT}, getRoutePoint);

const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const sortAndContentContainer = document.querySelector('.trip-events');

renderTemplate(menuContainer, createMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filterContainer, createFilterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(sortAndContentContainer, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(sortAndContentContainer, createTripPointListTemplate(), RenderPosition.BEFOREEND);

const pointContainer = document.querySelector('.trip-events__list');
renderTemplate(pointContainer, createFormPointTemplate(
  tripPoints[0]
), RenderPosition.BEFOREEND);

for (let i = 1; i < TRIP_POINT_COUNT; i++) {
  renderTemplate(pointContainer, createTripPointItemTemplate(tripPoints[i]), RenderPosition.BEFOREEND);
}
