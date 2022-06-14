import BaseApi from './BaseApi';

export default class RideApi extends BaseApi {
  list(query) {
    return this.network.get('/api/v1/rides', { params: query });
  }

  get(id) {
    return this.network.get(`/api/v1/rides/${id}`);
  }

  create(payload) {
    return this.network.post('/api/v1/rides/', payload);
  }

  createOffer(payload) {
    return this.network.post('/api/v1/offers', payload);
  }

  cancel(id, options) {
    return this.network.put(`/api/v1/rides/${id}/cancel`, options);
  }

  rating(id, options) {
    return this.network.put(`/api/v1/rides/${id}`, options);
  }

  getTerritories() {
    return this.network.get(`/api/v1/business-models/${process.env.BUSINESS_MODEL_ID}/territories`);
  }
}
