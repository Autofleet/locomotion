import React, { Fragment } from 'react';
import {
  TouchableOpacity, Image, StyleSheet, ViewPropTypes,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import propsTypes from 'prop-types';
import LinearGradient from '../LinearGradient';

const modes = {
  edit: require('./edit_btn.png'),
  add: require('./add_btn.png'),
};

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
    leftIcon: {
      width: 50,
      height: 50,
      position: 'relative',
      marginTop: -75,
      marginLeft: -90,
    },
  };

  defaultStyles.linearGradient.width = props.size;
  defaultStyles.linearGradient.height = props.size;
  defaultStyles.linearGradient = Object.assign(defaultStyles.linearGradient);
  const styles = StyleSheet.create(defaultStyles);
  const ImageComponent = props.source && props.source.uri && props.source.uri.substring(0, 4) === 'http' ? FastImage : Image;
  const borderRadius = { borderRadius: props.size / 2 };
  const borderRadiusSmall = { borderRadius: (props.size - 10) / 2 };
  return (
    <Fragment>
      <LinearGradient
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={[styles.linearGradient, props.containerStyle]}
      >
        <TouchableOpacity onPress={props.onPress} style={[styles.croper, borderRadius]}>
          <ImageComponent
            style={[styles.image, borderRadiusSmall]}
            source={props.source}
          />
        </TouchableOpacity>
      </LinearGradient>
      {props.mode in modes && (
      <TouchableOpacity onPress={props.onPress} style={{ width: 1, height: 1 }}>
        <Image onPress={props.onPress} style={styles.leftIcon} source={modes[props.mode]} />
      </TouchableOpacity>
      )}
    </Fragment>
  );
};

export default myThumbnail;


myThumbnail.defaultProps = {
  size: 220,
  onPress: () => null,
  mode: 'preview',
  source: require('./default.png'),
  containerStyle: {},
};

myThumbnail.propTypes = {
  size: propsTypes.oneOfType(propsTypes.number, propsTypes.string),
  onPress: propsTypes.func,
  mode: propsTypes.string,
  source: Image.propTypes.source,
  containerStyle: ViewPropTypes.style,
};
