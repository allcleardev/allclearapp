import Axios from 'axios';
import { forEach } from 'lodash';

export default class FacilityService {
  static serviceInstance = null;

  constructor() {
    this.baseURL = '/facilities';
  }

  static getInstance() {
    if (FacilityService.serviceInstance == null) {
      FacilityService.serviceInstance = new FacilityService();
    }

    return this.serviceInstance;
  }

  search(body) {
    // cleanup filters before sending
    forEach(body, (value, key) => {
      // remove filter from both places
      if (value === 'Any') {
        // delete appState.searchCriteria[key];
        delete body[key];
      }
    });

    return Axios({
      method: 'POST',
      url: `${this.baseURL}/search`,
      // params: req.query,
      data: body,
    });
  }
}
