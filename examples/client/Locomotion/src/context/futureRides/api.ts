import network from '../../services/network';

export const getFutureRides = async () => {
  const { data } = await network.get('api/v1/rides/future');
  return data;
};

export const getPriceCalculation = async (pricingCalculationId: string) => {
  const { data } = await network.get(`api/v1/price-calculation/${pricingCalculationId}`);
  return data;
};
