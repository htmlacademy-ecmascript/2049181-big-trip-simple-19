import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = () => '<p class="trip-events__msg">No data from server. Refresh the page.</p>';

export default class NoAdditionalDataView extends AbstractView {

  get template() {
    return createTemplate();
  }
}
