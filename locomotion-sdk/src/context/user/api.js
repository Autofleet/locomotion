import network from '../../services/network';

export const ImageUpload = async (formData) => {
    const { data } = await network.post('api/v1/me/image-upload', formData, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
  return data
}

export const getUserDetails = async () => {
    const { data } = await network.get('api/v1/me');
    return data
}

export const loginVert = async (body) => {
    const { data } = await network.post('api/v1/login/vert', body)
    return data
}

export const loginApi = async (body) => {
    const { data } = await network.post('api/v1/login', body)
    return data
}

export const updateUser = async (body) => {
    const { data } = await network.patch('api/v1/me', body);
    return data
}

export const getLoginSettings = async () => {
    const { data } = await network.get('/api/v1/login/settings');
    return data
}
