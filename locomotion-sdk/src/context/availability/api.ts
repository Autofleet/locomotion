import network from '../../services/network';

export const getVehicles = async (lat: string, lng: string) => {
    const {data: vehicles} = await network.get('/api/v1/availability', {
        params: {
            lat,
            lng 
        }
    });

    return vehicles;
}