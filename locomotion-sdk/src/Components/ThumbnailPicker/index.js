import React from 'react';
import propsTypes from 'prop-types';
/* eslint-disable class-methods-use-this */
import {
  Platform, ActionSheetIOS, UIManager, findNodeHandle,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import i18n from '../../I18n';
import Thumbnail from '../Thumbnail';
import { ImageUpload } from '../../context/user';

export default class ThumbnailPicker extends React.Component {
  constructor() {
    super()

    this.assets = [];
    this.state = {
      source: undefined
    }
  }

  onCancel = () => {
    console.log('User cancelled image picker');
  };

  onError = (error) => {
    console.log('ImagePicker Error: ', error);
  };

  onSelectPicture(response) {
    const {
      assets, errorCode, didCancel,
    } = response;
    if (didCancel) {
      this.onCancel()
    }

    if (errorCode) {
      this.onError(errorCode)
    }

    if (assets && assets.length) {
      this.onSuccess(assets);
    }
  }

  onSuccess = (response) => {
    const source = { uri: `data:image/jpeg;base64,${response[0].base64}` };
    console.log('source', source);

    this.setState({source});
    this.uploadImage(response[0]);
  };

  uploadImage = async (data) => {
    const newImage = await ImageResizer.createResizedImage(data.uri, 180, 180, 'PNG', 80);
    const formData = new FormData();
    formData.append('avatar', {
      uri: newImage.uri,
      type: 'image/jpeg', // or data.type
      name: 'avatar',
    });

    const response = await ImageUpload(formData)

    if (response.status) {
      return response.url;
    }
    return false;
  }

  handleImage(data) {
    console.log('Data of the uploaded image', data);
    this.uploadPromise = this.uploadImage(data);
    this.props.onImageChoose(this.uploadPromise);
  }

  showImagePicker(event) {
    const options = [i18n.t('popups.photoUpload.takePhoto'), i18n.t('popups.photoUpload.choosePhoto')];
    const pickerOptions = {
      mediaType: 'photo',
      cameraType: 'back',
      includeBase64: true,
      saveToPhotos: false,
      selectionLimit: 1,
    }
    const imageCallback = (response) => this.onSelectPicture(response);
    
    if (Platform.OS === 'android') {
      UIManager.showPopupMenu(
        findNodeHandle(event.target),
        options,
        () => null,
        (action, buttonIndex) => {
          if (action !== 'itemSelected') {
            return;
          }

          if (buttonIndex === 0) {
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
          options: [i18n.t('live.phoneCallOptions.cancel'), ...options],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            this.onCancel()
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
  }

  render() {
    return (
      <Thumbnail
        mode={this.props.avatarSource ? 'edit' : 'add'}
        onPress={this.showImagePicker.bind(this)}
        containerStyle={{ marginTop: 50, marginBottom: 25 }}
        size={180}
        source={(this.state.source)}
      />
    );
  }
}

ThumbnailPicker.defaultProps = {
  onImageChoose: () => null,
  avatarSource: undefined,
};

ThumbnailPicker.propTypes = {
  onImageChoose: propsTypes.func,
  avatarSource: propsTypes.string,
};
