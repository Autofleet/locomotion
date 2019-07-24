import React from 'react';
import ImagePicker from 'react-native-image-picker';
import propsTypes from 'prop-types';
import ImageResizer from 'react-native-image-resizer';

import network from '../../services/network';
import Thumbnail from '../Thumbnail';

export default class ThumbnailPicker extends React.Component {
  constructor() {
    super();
    this.state = {
      avatarSource: undefined,
    };

    // if (userContext.state.avatar) {
    //   this.state.avatarSource = { uri: userContext.state.avatar };
    // }
  }

  uploadPromise = false;

  openImagePicker() {
    ImagePicker.showImagePicker({ allowsEditing: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: `data:image/jpeg;base64,${response.data}` };
        this.setState({
          avatarSource: source,
        });
        this.handleImage(response);
      }
    });
  }

  uploadImage = async (data) => {
    const newImage = await ImageResizer.createResizedImage(data.uri, 180, 180, 'PNG', 80);
    const formData = new FormData();
    formData.append('avatar', {
      uri: newImage.uri,
      type: 'image/jpeg', // or data.type
      name: 'avatar',
    });

    const { data: response } = await network.post('api/v1/me/image-upload', formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });

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

  render() {
    return (
      <Thumbnail
        mode={this.state.avatarSource ? 'edit' : 'add'}
        onPress={this.openImagePicker.bind(this)}
        containerStyle={{ marginTop: 50, marginBottom: 50 }}
        size={180}
        source={this.state.avatarSource}
      />
    );
  }
}

ThumbnailPicker.defaultProps = {
  onImageChoose: () => null,
};

ThumbnailPicker.propTypes = {
  onImageChoose: propsTypes.func,
};
