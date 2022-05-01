import React from 'react';
import ImagePicker from 'react-native-image-picker';
import propsTypes from 'prop-types';
import ImageResizer from 'react-native-image-resizer';

import network from '../../services/network';
import Thumbnail from '../Thumbnail';
import { ImageUpload } from '../../context/networkRequests';

export default class ThumbnailPicker extends React.Component {
  constructor() {
    super();
    this.state = {
      avatarSource: undefined,
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.avatarSource && !this.state.avatarSource) {
      this.setState({ avatarSource: { uri: newProps.avatarSource } });
    }
  }

  uploadPromise = false;

  openImagePicker() {
    ImagePicker.showImagePicker({ allowsEditing: true }, (response) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
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

  render() {
    return (
      <Thumbnail
        mode={this.props.avatarSource ? 'edit' : 'add'}
        onPress={this.openImagePicker.bind(this)}
        containerStyle={{ marginTop: 50, marginBottom: 25 }}
        size={180}
        source={(this.state.avatarSource)}
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
