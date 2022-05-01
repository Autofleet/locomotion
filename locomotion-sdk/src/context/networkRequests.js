export const ImageUpload = async (formData) => {
    const { data } = await network.post('api/v1/me/image-upload', formData, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
  return data
}

export const getAppSettings = async () => {
    const { data } = await network.get('/api/v1/me/app-settings')
    return data
}

export const getWorkingHoursData = async () => {
    const { data } = await network.get('/api/v1/me/app-settings/working-hours');
    return data
}