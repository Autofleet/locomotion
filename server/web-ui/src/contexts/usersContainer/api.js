import networkService from '../../Services/network';

export const getUsers = async () => {
  const { data: automations } = await networkService.get('/api/v1/admin/users');
  return automations;
};
export const add = async values => networkService.post('/api/v1/admin/users', values);
export const update = async (id, values) => (await networkService.patch(`/api/v1/admin/users/${id}`, values)).data;
export const find = async (id) => {
  const { data: driver } = await networkService.get(`/api/v1/admin/users/${id}`);
  return driver;
};

export const remove = async id => (await networkService.delete(`/api/v1/admin/users/${id}`)).data;


export const uploadImage = async formData => (await networkService.post('/api/v1/admin/users/upload-image', formData, {
  headers: {
    'content-type': 'multipart/form-data',
  },
})).data;
