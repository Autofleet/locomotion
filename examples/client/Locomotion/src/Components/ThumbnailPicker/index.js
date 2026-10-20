import React, { useEffect, useState } from 'react';
import propsTypes from 'prop-types';
/* eslint-disable class-methods-use-this */
import {
  Alert,
  PermissionsAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import i18n from '../../I18n';
import Thumbnail from '../Thumbnail';
import { ImageUpload } from '../../context/user/api';

const ThumbnailPicker = (props) => {
  const {
    onImageChoose = () => null,
    avatarSource = undefined,
    size,
  } = props;
  const [loading, setLoading] = useState(false);
  const onCancel = () => {
    console.log('User cancelled image picker');
  };

  const onError = (error) => {
    console.log('ImagePicker Error: ', error);
  };

  const onSelectPicture = (response) => {
    const { assets, errorCode, didCancel } = response;
    if (didCancel) {
      onCancel();
    }

    if (errorCode) {
      onError(errorCode);
    }

    if (assets && assets.length) {
      onSuccess(assets);
    }
  };

  const uploadImage = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: data.uri,
        type: data.type || 'image/jpeg',
        name: 'avatar',
      });

      const response = await ImageUpload(formData);

      if (response.status) {
        return response.url;
      }
      return false;
    } catch (error) {
      console.log('ImageUpload Error: ', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleImage = async (data) => {
    const uploadPromise = await uploadImage(data);
    onImageChoose(uploadPromise);
  };

  const onSuccess = (response) => {
    handleImage(response[0]);
  };

  const insurePermission = async () => {
    const isCameraGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (!isCameraGranted) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    }
  };

  const showImagePicker = (event) => {
    const options = [
      i18n.t('popups.photoUpload.takePhoto'),
      i18n.t('popups.photoUpload.choosePhoto'),
    ];
    const pickerOptions = {
      mediaType: 'photo',
      cameraType: 'back',
      includeBase64: true,
      saveToPhotos: false,
      selectionLimit: 1,
      maxHeight: 180,
      maxWidth: 180,
    };
    const imageCallback = response => onSelectPicture(response);

    Alert.alert(
      '',
      undefined,
      [
        { text: options[0], onPress: async () => { await insurePermission(); launchCamera(pickerOptions, imageCallback); } },
        { text: options[1], onPress: () => launchImageLibrary(pickerOptions, imageCallback) },
        { text: i18n.t('general.cancel'), style: 'cancel' },
      ],
    );
  };

  return (
    <Thumbnail
      mode={avatarSource ? 'edit' : 'add'}
      onPress={showImagePicker}
      size={size || 180}
      source={avatarSource}
      showLoader={loading}
    />
  );
};

ThumbnailPicker.propTypes = {
  onImageChoose: propsTypes.func,
  avatarSource: propsTypes.string,
};

export default ThumbnailPicker;
