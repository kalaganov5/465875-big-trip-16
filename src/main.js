import FilterView from './view/filters-view.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import TripPointContainer from './view/trip-point-container-view.js';
import TripPointView from './view/trip-point-item-view';
import FormTripPointView from './view/form-trip-point-view.js';
import TripPointEmptyView from './view/trip-point-empty-view.js';

import {RenderPosition, renderElement} from './render.js';
import {getRoutePoint} from './mock/get-route-point.js';

const TRIP_POINT_COUNT = 20;
const tripPoints = Array.from({length: TRIP_POINT_COUNT}, getRoutePoint);

const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const sortAndContentContainer = document.querySelector('.trip-events');

renderElement(filterContainer, new FilterView().element, RenderPosition.BEFOREEND);
renderElement(menuContainer, new MenuView().element, RenderPosition.BEFOREEND);

/**
 *
 *
 * @param {object} container контейнер для вставки точки маршрута
 * @param {object} tripPointItem данные о точки маршрута
 */
const renderTripPoint = (container, tripPointItem) => {
  const tripPointComponent = new TripPointView(tripPointItem);
  const tripPointFormComponent = new FormTripPointView(tripPointItem);
  const tripPointButton = tripPointComponent.element.querySelector('.event__rollup-btn');

  const replaceFormToTripPoint = () => {
    container.replaceChild(tripPointComponent.element, tripPointFormComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      replaceFormToTripPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const tripPointSubmitForm = (evt) => {
    evt.preventDefault();
    replaceFormToTripPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const tripPointCloseForm = (evt) => {
    evt.preventDefault();
    replaceFormToTripPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  };

  // обработчик на раскрытие
  tripPointButton.addEventListener('click', () => {
    const itemPointCloseButton = tripPointFormComponent.element.querySelector('.event__rollup-btn');
    const tripPointForm = tripPointFormComponent.element.querySelector('.event--edit');

    container.replaceChild(tripPointFormComponent.element, tripPointComponent.element);
    document.addEventListener('keydown', onEscKeyDown);

    // обработчик отправки и закрытие формы
    tripPointForm.addEventListener('submit', tripPointSubmitForm);

    // обработчик кнопки закрыть
    itemPointCloseButton.addEventListener('click', tripPointCloseForm);
  });

  renderElement(container, tripPointComponent.element, RenderPosition.BEFOREEND);
};

/**
 *
 * @param {object} contentContainer контейнер
 * @param {object} tripPointItems данные с точками маршрута
 */
const renderContent = (contentContainer, tripPointItems) => {
  // в будущем сделать функцию которая фильтрует и подсчитывает
  // взаимодействует с компонентом FilterView
  // показывая исходя из выбранного фильтра меню
  // Everything, Future, Past
  if (tripPointItems.length === 0) {
    renderElement(contentContainer, new TripPointEmptyView('everything').element, RenderPosition.BEFOREEND);
    return;
  }

  renderElement(contentContainer, new SortView().element, RenderPosition.BEFOREEND);
  const tripPointContainerComponent = new TripPointContainer();
  renderElement(contentContainer, tripPointContainerComponent.element, RenderPosition.BEFOREEND);

  tripPointItems.forEach((tripPointItem) => {
    renderTripPoint(tripPointContainerComponent.element, tripPointItem);
  });
};

renderContent(sortAndContentContainer, tripPoints);
