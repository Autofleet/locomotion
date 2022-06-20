import React from 'react';
import { Image, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import propsTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../Button';
import avatarIcon from './default.png';
import editIcon from './edit_btn.png';
import addIcon from './add_btn.png';
import lightLoader from '../../assets/loader.json';

const modes = {
  edit: editIcon,
  add: addIcon,
};

const Container = styled.View``;
const myThumbnail = (props) => {
  const defaultStyles = {
    linearGradient: {
      padding: 3,
      borderRadius: 100,
    },
    croper: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      backgroundColor: '#636363',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 100,
    },
    iconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
    icon: {
      width: 50,
      height: 50,
    },
  };

  defaultStyles.linearGradient.width = props.size;
  defaultStyles.linearGradient.height = props.size;
  defaultStyles.linearGradient = Object.assign(defaultStyles.linearGradient);
  const styles = StyleSheet.create(defaultStyles);
  const ImageComponent = props.source && props.source.substring(0, 4) === 'http' ? FastImage : Image;
  const borderRadius = { borderRadius: props.size / 2 };
  const borderRadiusSmall = { borderRadius: (props.size - 10) / 2 };
  return (
    <Container style={{ width: props.size, height: props.size }}>
      <Button
        noBackground
        onPress={props.onPress}
        style={[styles.croper, borderRadius]}
        data-test-id="ImagePickerButton"
      >
        {props.showLoader ? (
          <LottieView
            style={undefined}
            ref={(animation) => {
              this.animation = animation;
              if (animation) {
                animation.play();
              }
            }}
            source={lightLoader}
            autoPlay
            loop
          />
        ) : (
          <ImageComponent
            style={[styles.image, borderRadiusSmall]}
            source={props.source ? { uri: props.source } : avatarIcon}
          />
        )}
      </Button>
      {props.mode in modes && (
        <Button
          noBackground
          onPress={props.onPress}
          style={styles.iconContainer}
          data-test-id={`${props.mode}ImageButton`}
        >
          <Image
            onPress={props.onPress}
            style={styles.icon}
            source={modes[props.mode]}
          />
        </Button>
      )}
    </Container>
  );
};

export default myThumbnail;

myThumbnail.defaultProps = {
  size: 220,
  onPress: () => null,
  mode: 'preview',
  source: null,
  showLoader: false,
};

myThumbnail.propTypes = {
  size: propsTypes.oneOfType([propsTypes.number, propsTypes.string]),
  onPress: propsTypes.func,
  mode: propsTypes.string,
  source: Image.propTypes.source,
  showLoader: propsTypes.bool,
};
