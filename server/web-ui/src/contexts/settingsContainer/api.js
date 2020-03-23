import networkService from '../../Services/network';

export const getSettings = async () => {
    const { data: settings } = await networkService.get('/api/v1/admin/settings');
    return settings;
};
export const update = async (key, values) => (await networkService.patch(`/api/v1/admin/settings/update-setting/${key}`, values)).data;
