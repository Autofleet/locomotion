import network from '../../services/network'; 

export const getAppSettings = async () => {
    const { data } = await network.get('/api/v1/me/app-settings')
    return data
}

export const getWorkingHoursData = async () => {
    const { data } = await network.get('/api/v1/me/app-settings/working-hours');
    return data
}