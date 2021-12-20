import FilterView from './view/filters-view.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import TripPointContainer from './view/trip-point-container-view.js';
import TripPointView from './view/trip-point-item-view';
import FormTripPointView from './view/form-trip-point-view.js';
import TripPointEmptyView from './view/trip-point-empty-view.js';

import {RenderPosition, renderElement, replace} from './utils/render.js';
import {getRoutePoint} from './mock/get-route-point.js';

const TRIP_POINT_COUNT = 20;
const tripPoints = Array.from({length: TRIP_POINT_COUNT}, getRoutePoint);

const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const sortAndContentContainer = document.querySelector('.trip-events');

renderElement(filterContainer, new FilterView(), RenderPosition.BEFOREEND);
renderElement(menuContainer, new MenuView(), RenderPosition.BEFOREEND);

/**
 *
 *
 * @param {object} container контейнер для вставки точки маршрута
 * @param {object} tripPointItem данные о точки маршрута
 */
const renderTripPoint = (container, tripPointItem) => {
  const tripPointComponent = new TripPointView(tripPointItem);
  const tripPointFormComponent = new FormTripPointView(tripPointItem);

  const replaceFormToTripPoint = () => {
    replace(tripPointComponent, tripPointFormComponent);
  };

  const replaceTripPointToForm = () => {
    replace(tripPointFormComponent, tripPointComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      replaceFormToTripPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  // обработчик на раскрытие
  tripPointComponent.setEditTripPointHandler(() => {

    replaceTripPointToForm();

    document.addEventListener('keydown', onEscKeyDown);

    // Форма обработчик отправки и закрытие
    tripPointFormComponent.setFormSubmitHandler(() => {
      replaceFormToTripPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    // Форма обработчик кнопки закрыть
    tripPointFormComponent.setFormCloseHandler(() => {
      replaceFormToTripPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });
  });

  renderElement(container, tripPointComponent, RenderPosition.BEFOREEND);
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
    renderElement(contentContainer, new TripPointEmptyView('everything'), RenderPosition.BEFOREEND);
    return;
  }

  renderElement(contentContainer, new SortView(), RenderPosition.BEFOREEND);
  const tripPointContainerComponent = new TripPointContainer();
  renderElement(contentContainer, tripPointContainerComponent, RenderPosition.BEFOREEND);

  tripPointItems.forEach((tripPointItem) => {
    renderTripPoint(tripPointContainerComponent.element, tripPointItem);
  });
};

renderContent(sortAndContentContainer, tripPoints);
