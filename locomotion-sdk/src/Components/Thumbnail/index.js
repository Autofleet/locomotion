import React, { Fragment } from 'react';
import {
  Image, StyleSheet, ViewPropTypes,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import propsTypes from 'prop-types';
import LinearGradient from '../LinearGradient';
import Button from '../Button';
import styled from 'styled-components';

const modes = {
  edit: require('./edit_btn.png'),
  add: require('./add_btn.png'),
};

const Container = styled.View`

`;
const myThumbnail = (props) => {
  const defaultStyles = {
    linearGradient: {
      padding: 3,
      borderRadius: 100,
    },
    croper: {
      padding: 5,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      backgroundColor: '#f6f6f8',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 100,
    },
    iconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0
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
    <Container 
      style={{width: props.size, height: props.size}} >
      <LinearGradient
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={[styles.linearGradient]}
      >
        <Button 
          onPress={props.onPress} 
          style={[styles.croper, borderRadius]} 
          data-test-id='ImagePickerButton'>
          <ImageComponent
            style={[styles.image, borderRadiusSmall]}
            source={{uri: props.source}}
          />
        </Button>
      </LinearGradient>
      {props.mode in modes && (
      <Button 
        onPress={props.onPress} 
        style={styles.iconContainer} 
        data-test-id={`${props.mode}ImageButton`}>
        <Image 
          onPress={props.onPress} 
          style={styles.icon} 
          source={modes[props.mode]} />
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
  source: require('./default.png'),
};

myThumbnail.propTypes = {
  size: propsTypes.oneOfType([propsTypes.number, propsTypes.string]),
  onPress: propsTypes.func,
  mode: propsTypes.string,
  source: Image.propTypes.source,
};
