import {RenderPosition, renderTemplate} from './render.js';
import {createMenuTemplate} from './view/menu-view.js';
import {createFilterTemplate} from './view/filters-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createTripPointListTemplate, createTripPointItemTemplate} from './view/trip-point-item-view.js';
import {createFormEditPointTemplate} from './view/form-edit-trip-point-view.js';
import {createFormNewPointTemplate} from './view/form-create-trip-point-view.js';

const TRIP_POINT_COUNT = 3;

const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const sortAndContentContainer = document.querySelector('.trip-events');

renderTemplate(menuContainer, createMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filterContainer, createFilterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(sortAndContentContainer, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(sortAndContentContainer, createTripPointListTemplate(), RenderPosition.BEFOREEND);

const pointContainer = document.querySelector('.trip-events__list');
renderTemplate(pointContainer, createFormEditPointTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(pointContainer, createFormNewPointTemplate(), RenderPosition.BEFOREEND);

for (let i = 0; i < TRIP_POINT_COUNT; i++) {
  renderTemplate(pointContainer, createTripPointItemTemplate(), RenderPosition.BEFOREEND);
}
