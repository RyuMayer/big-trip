import { RenderPosition, render } from './framework/render';

import EventsApiService from './service/events-api-service';

import DestinationsModel from '@src/model/destinations-model';
import OffersModel from '@src/model/offers-model';
import EventsModel from '@src/model/events-model';
import FilterModel from './model/filter-model';

import FilterPresenter from './presenter/filter-presenter';
import TripListPresenter from '@src/presenter/trip-list-presenter';
import InfoPresenter from './presenter/info-presenter';

import AddButtonView from './view/add-button-view';

const AUTHORIZATION = 'Basic 8JdP2qR4zX1mL6k';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const eventsApiService = new EventsApiService(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel(eventsApiService);
const destinationsModel = new DestinationsModel(eventsApiService);
const offersModel = new OffersModel(eventsApiService);
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({ filterModel, eventsModel });
const infoPresenter = new InfoPresenter({
  destinationsModel,
  eventsModel,
  offersModel,
});
const tripListPresenter = new TripListPresenter({
  destinationsModel,
  offersModel,
  eventsModel,
  filterModel,
  onAddEventDestroy: handleAddEventClose,
});

const addButtonComponent = new AddButtonView({
  onClick: handleAddButtonClick,
});

function handleAddButtonClick() {
  tripListPresenter.addEvent();
  addButtonComponent.element.disabled = true;
}

function handleAddEventClose() {
  tripListPresenter.closeAddEvent();
  addButtonComponent.element.disabled = false;
}

render(
  addButtonComponent,
  document.querySelector('.trip-main'),
  RenderPosition.BEFOREEND,
);

filterPresenter.init();
tripListPresenter.init();
infoPresenter.init();

Promise.all([destinationsModel.init(), offersModel.init(), eventsModel.init()])
  .then(() => {
    eventsModel.start();
    addButtonComponent.element.disabled = false;
  })
  .catch(() => {
    eventsModel.failed();
  });
