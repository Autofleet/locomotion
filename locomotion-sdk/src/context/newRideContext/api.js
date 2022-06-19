import network from '../../services/network';

export const createServiceEstimations = (stopPoints) => {
    const { data } = await network.post('api/v1/services/service-estimations', { stopPoints });
    return data;
}

export const getServices = () => {
    const { data } = await network.get('api/v1/services');
    return data;
}