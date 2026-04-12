import React, { useContext } from 'react';
import { Image, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import propsTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../Button';
import avatarIcon from './default.png';
import editIcon from './edit.svg';
import addIcon from './add.svg';
import SvgIcon from '../SvgIcon';
import Loader from '../Loader';
import { Context as ThemeContext } from '../../context/theme';

const modes = {
  edit: editIcon,
  add: addIcon,
};

const BORDER_RADIUS = 1000;

const Container = styled.View``;
const myThumbnail = ({
  size = 220,
  onPress = () => null,
  mode = 'preview',
  source = null,
  showLoader = false,
}) => {
  const { primaryColor } = useContext(ThemeContext);

  const defaultStyles = {
    linearGradient: {
      padding: 3,
      borderRadius: BORDER_RADIUS,
    },
    croper: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BORDER_RADIUS,
      backgroundColor: '#636363',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: BORDER_RADIUS,
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

  defaultStyles.linearGradient.width = size;
  defaultStyles.linearGradient.height = size;
  defaultStyles.linearGradient = Object.assign(defaultStyles.linearGradient);
  const styles = StyleSheet.create(defaultStyles);
  const ImageComponent = source && source.substring(0, 4) === 'http' ? FastImage : Image;
  const borderRadius = { borderRadius: size };
  const borderRadiusSmall = { borderRadius: (size - 10) / 2 };
  return (
    <Container style={{ width: size, height: size }}>
      <Button
        noBackground
        onPress={onPress}
        style={[styles.croper, borderRadius]}
        testID="ImagePickerButton"
      >
        {showLoader ? (
          <Loader
            lottieViewStyle={{
              height: 15, width: 15,
            }}
          />
        ) : (
          <ImageComponent
            style={[styles.image, borderRadiusSmall]}
            source={source ? { uri: source } : avatarIcon}
          />
        )}
      </Button>
      {mode in modes && (
        <Button
          noBackground
          onPress={onPress}
          style={styles.iconContainer}
          testID={`${mode}ImageButton`}
        >
          <SvgIcon Svg={modes[mode]} height={48} width={48} fill={primaryColor} />
        </Button>
      )}
    </Container>
  );
};

export default myThumbnail;

myThumbnail.propTypes = {
  size: propsTypes.oneOfType([propsTypes.number, propsTypes.string]),
  onPress: propsTypes.func,
  mode: propsTypes.string,
  source: propsTypes.string,
  showLoader: propsTypes.bool,
};
