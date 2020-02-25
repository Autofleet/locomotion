import networkService from '../../Services/network';

export const getSettings = async () => {
    const { data: settings } = await networkService.get('/api/v1/admin/settings');
    return settings;
};
// export const add = async values => networkService.post('/api/v1/admin/users', values);
export const update = async (id, values) => (await networkService.patch(`/api/v1/admin/settings/${id}`, values)).data;
// export const find = async (id) => {
//     const { data: driver } = await networkService.get(`/api/v1/admin/users/${id}`);
//     return driver;
// };
//
// export const remove = async id => (await networkService.delete(`/api/v1/admin/users/${id}`)).data;
