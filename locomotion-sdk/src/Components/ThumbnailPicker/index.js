import React, { useEffect, useState } from 'react';
import { Button, PermissionsAndroid, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import propsTypes from 'prop-types';
/* eslint-disable class-methods-use-this */
import {
  Platform, ActionSheetIOS, UIManager, findNodeHandle,
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import i18n from '../../I18n';
import Thumbnail from '../Thumbnail';
import { ImageUpload } from '../../context/user/api';

const ThumbnailPicker = (props) => {
  const [isCameraGranted, setIsCameraGranted] = useState(false)
  const onCancel = () => {
    console.log('User cancelled image picker');
  };

  const onError = (error) => {
    console.log('ImagePicker Error: ', error);
  };

  const onSelectPicture = (response) => {
    const {
      assets, errorCode, didCancel,
    } = response;
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
    const newImage = await ImageResizer.createResizedImage(data.uri, 180, 180, 'PNG', 80);
    const formData = new FormData();
    formData.append('avatar', {
      uri: newImage.uri,
      type: 'image/jpeg', // or data.type
      name: 'avatar',
    });

    const response = await ImageUpload(formData);

    if (response.status) {
      return response.url;
    }
    return false;
  };

  const handleImage = async (data) => {
    console.log('Data of the uploaded image', data);
    const uploadPromise = await uploadImage(data);
    props.onImageChoose(uploadPromise);
  };


  const onSuccess = (response) => {
    handleImage(response[0]);
  };

  const insurePermission = async () => {
    if (!isCameraGranted) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
  }
}


  const showImagePicker = (event) => {
    const options = [i18n.t('popups.photoUpload.takePhoto'), i18n.t('popups.photoUpload.choosePhoto')];
    const pickerOptions = {
      mediaType: 'photo',
      cameraType: 'back',
      includeBase64: true,
      saveToPhotos: false,
      selectionLimit: 1,
    };
    const imageCallback = response => onSelectPicture(response);

    if (Platform.OS === 'android') {
      UIManager.showPopupMenu(
        findNodeHandle(event.target),
        options,
        () => null,
        async (action, buttonIndex) => {
          if (action !== 'itemSelected') {
            return;
          }

          if (buttonIndex === 0) {
            await insurePermission()
            launchCamera(pickerOptions, imageCallback);
          }

          if (buttonIndex === 1) {
            launchImageLibrary(pickerOptions, imageCallback);
          }
        },
      );
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [i18n.t('general.cancel'), ...options],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            onCancel();
          }

          if (buttonIndex === 1) {
            launchCamera(pickerOptions, imageCallback);
          }

          if (buttonIndex === 2) {
            launchImageLibrary(pickerOptions, imageCallback);
          }
        },
      );
    }
  };

  const camera = async  () => {
    const isGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
    setIsCameraGranted(isGranted)
  }
  useEffect(() => {
    camera()
  }, [])

  return (
    <Thumbnail
      mode={props.avatarSource ? 'edit' : 'add'}
      onPress={showImagePicker}
      size={props.size || 180}
      source={props.avatarSource}
    />
  );
};

ThumbnailPicker.defaultProps = {
  onImageChoose: () => null,
  avatarSource: undefined,
};

ThumbnailPicker.propTypes = {
  onImageChoose: propsTypes.func,
  avatarSource: propsTypes.string,
};

export default ThumbnailPicker;
