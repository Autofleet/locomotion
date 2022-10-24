import networkService from '../../services/network';

export const getUserMessages = async (userId: string) => {
  const { data } = await networkService.get('api/v2/user-messages', { params: { userId } });
  return data;
};

export const getMessage = async (messageId: string) => {
  const { data } = await networkService.get(`api/v2/messages/${messageId}`);
  return data;
};

export const markReadMessage = async (userMessageIds = []) => {
  console.log('userMessageIds', userMessageIds);

  try {
    const { data } = await networkService.post('api/v2/user-messages/read', { ids: userMessageIds });
    console.log(data);
    return data;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

export const dismissMessage = async (userMessageIds = []) => {
  const { data } = await networkService.post('api/v2/user-messages/dismiss', { ids: userMessageIds });
  return data;
};
