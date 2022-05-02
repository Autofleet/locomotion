import network from '../services/network';

export const ImageUpload = async (formData) => {
    const { data } = await network.post('api/v1/me/image-upload', formData, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
  return data
}

export const getUserDetails = async () => {
    return network.get('api/v1/me');
}

export const loginVert = async (body) => {
    const { data } = await network.post('api/v1/login/vert', body)
    return data
}

export const loginApi = async (body) => {
    await network.post('api/v1/login', body)
}

export const updateUser = async (body) => {
    return network.patch('api/v1/me', body);
}

export const loginRefresh = async (body) => {
    return network.post('api/v1/login/refresh', body)
}


export const getLoginSettings = async () => {
    const { data } = await network.get('/api/v1/login/settings');
    return data
}