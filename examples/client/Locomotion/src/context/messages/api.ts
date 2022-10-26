import networkService from '../../services/network';

export const getUserMessages = async (userId: string) => {
  const { data } = await networkService.get('api/v1/me/user-messages', { params: { userId } });
  return data;
};

export const getMessage = async (messageId: string, userId: string | null) => {
  const { data } = await networkService.get(`api/v1/me/messages/${messageId}`, { params: { userId } });
  return data;
};

export const markReadMessage = async (userMessageIds: string[] = []) => {
  const { data } = await networkService.post('api/v1/me/user-messages/read', { ids: userMessageIds });
  return data;
};

export const dismissMessage = async (userMessageIds: string[] = []) => {
  const { data } = await networkService.post('api/v1/me/user-messages/dismiss', { ids: userMessageIds });
  return data;
};
