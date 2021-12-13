import FilterView from './view/filters-view.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import TripPointContainer from './view/trip-point-container-view.js';
import TripPointView from './view/trip-point-item-view';
import FormTripPointView from './view/form-trip-point-view.js';

import {RenderPosition, renderElement} from './render.js';
import {getRoutePoint} from './mock/get-route-point.js';

const TRIP_POINT_COUNT = 20;
const tripPoints = Array.from({length: TRIP_POINT_COUNT}, getRoutePoint);

const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const sortAndContentContainer = document.querySelector('.trip-events');

renderElement(filterContainer, new FilterView().element, RenderPosition.BEFOREEND);
renderElement(menuContainer, new MenuView().element, RenderPosition.BEFOREEND);

const renderContent = (contentContainer, tripPointItems) => {
  if (tripPointItems.length > 0) {
    renderElement(contentContainer, new SortView().element, RenderPosition.BEFOREEND);
    const tripPointContainerComponent = new TripPointContainer();
    renderElement(contentContainer, tripPointContainerComponent.element, RenderPosition.BEFOREEND);
    for (let i = 0; i < tripPointItems.length; i++) {
      const itemPointComponent = new TripPointView(tripPointItems[i]);
      const itemPointButton = itemPointComponent.element.querySelector('.event__rollup-btn');

      // обработчик на раскрытие формы
      itemPointButton.addEventListener('click', () => {
        const itemPointEdit = new FormTripPointView(tripPointItems[i]);
        const itemPointForm = itemPointEdit.element.querySelector('.event--edit');

        // обработчик закрытие формы
        itemPointForm.addEventListener('submit', (evt) => {
          evt.preventDefault();
          tripPointContainerComponent.element.replaceChild(itemPointComponent.element, itemPointEdit.element);
        });

        tripPointContainerComponent.element.replaceChild(itemPointEdit.element, itemPointComponent.element);
      });
      renderElement(tripPointContainerComponent.element, itemPointComponent.element, RenderPosition.BEFOREEND);
    }
  } else {
    // Если ещё нет точке маршрута
  }
};

renderContent(sortAndContentContainer, tripPoints);
