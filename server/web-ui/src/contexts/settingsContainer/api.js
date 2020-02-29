import networkService from '../../Services/network';

export const getSettings = async () => {
    const { data: settings } = await networkService.get('/api/v1/admin/settings');
    return settings;
};
export const update = async (id, values) => (await networkService.patch(`/api/v1/admin/settings/${id}`, values)).data;
