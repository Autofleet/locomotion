import {BaseApi} from "./BaseApi";

export class PaymentApi extends BaseApi {
  async getCustomer(id) {
    return this.network.get(`/api/v1/customer/${id}`, {
      params: {
        businessModelId: process.env.BUSINESS_MODEL_ID,
      },
    });
  }

  createCustomer(payload) {
    return this.network.post('/api/v1/customer', payload);
  }

  createPaymentIntent(payload) {
    return this.network.post('/api/v1/payment/setup', payload);
  }

  listMethods(userId) {
    return this.network.get('/api/v1/payment/methods', {
      params: {
        businessModelId: process.env.BUSINESS_MODEL_ID,
        userId,
      },
    });
  }

  detachPaymentMethod(payload) {
    return this.network.post('/api/v1/payment/methods/detach', payload);
  }
}
