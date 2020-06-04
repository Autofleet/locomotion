import networkService from '../../Services/network';

export const getSlots = async () => {
  const { data: slots } = await networkService.get('/api/v1/admin/service-hours');
  return slots;
};
export const add = async values => networkService.post('/api/v1/admin/service-hours', values);
export const remove = async id => (await networkService.delete(`/api/v1/admin/service-hours/${id}`)).data;
