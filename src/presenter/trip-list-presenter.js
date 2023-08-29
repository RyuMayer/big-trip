import { render } from '@src/framework/render';
import { getUpdatedEvents } from '@src/utils/event-utils';

import EventPresenter from './event-presenter';

import SortView from '@src/view/sort-view';
import TripListView from '@src/view/trip-list-view';
import NoEventView from '@src/view/no-event-view';

export default class TripListPresenter {
  #tripListComponent = new TripListView();
  #tripListContainer = document.querySelector('.trip-events');

  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;

  #events = [];

  #eventPresenters = new Map();

  constructor({ destinationsModel, offersModel, eventsModel }) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;
  }

  init() {

    this.#events = this.#eventsModel.get();

    if (this.#events.length === 0) {
      this.#renderNoEvent();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
  }

  #renderEventList() {
    render(this.#tripListComponent, this.#tripListContainer);
    this.#events.forEach(this.#renderEvent);
  }

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter({
      eventContainer: this.#tripListComponent.element,

      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,

      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  };

  #renderNoEvent() {
    render(new NoEventView(), this.#tripListContainer);
  }

  #renderSort() {
    render(new SortView(), this.#tripListContainer);
  }

  #clearEventList() {
    this.#eventPresenters.forEach((event) => event.destroy());
    this.#eventPresenters.clear();
  }

  #handleEventChange = (updatedEvent) => {
    this.#events = getUpdatedEvents(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
