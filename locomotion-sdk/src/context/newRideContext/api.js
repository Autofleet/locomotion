import network from '../../services/network';

export const createServiceEstimations = async (stopPoints) => {
    try {
    const res = await network.post('api/v1/services/service-estimations', { stopPoints });
    console.log(res)
    return res.data;
    } catch (e) {
        console.log(e)
    }
}

export const getServices = async () => {
    const { data } = await network.get('api/v1/services');
    return data;
}