import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import styled from 'styled-components';
import RNSwipeVerify from 'react-native-swipe-verify';
import LinearGradient from '../LinearGradient';

import { inputHeight, appPalette } from '../../assets/style-settings';

const SliderContainer = styled.View`
  border-radius: 24px;
  height: 40px;

  margin-bottom: 20px;
  width: 80%;
  margin: 20px auto;
`;

const ButtonText = styled.Text`
  color: ${({ verified }) => (!verified ? '#08355c' : '#ffffff')};
`;

const styleScheme = {
  default: {
    buttonSize: 60,
    backgroundColor: '#f0f0f0',
    textColor: '#08355c',
    buttonColor: '#08355c',
    borderRadius: 30,
  },
  verified: {
    backgroundColor: '#08902d',
    textColor: '#ffffff',
    buttonColor: '#08902d',
  },
};
const Button = ({
  children, style, hollow, setLoading, onVerified, text, verifiedText, ...props
}) => {
  const [loadingState, setLoadingState] = useState(false);
  const [verifiedState, setVerifiedState] = useState(false);
  const sliderRef = useRef();
  const onPressWithLoading = async (args) => {
    setLoadingState(true);
    await onPress(args);
    return setLoadingState(false);
  };

  return (
    <SliderContainer>
      <RNSwipeVerify
        ref={ref => sliderRef.current = ref}
        okButton={{ visible: true, duration: 400 }}
        onVerified={async () => {
          try {
            await onVerified();
            setVerifiedState(true);
          } catch (e) {
            sliderRef.current.reset();
          }
        }}
        icon={(
          <Image
            source={require('../../assets/slider-arrow.png')}
            style={{ width: 40, height: 40 }}
          />
        )}
        {...styleScheme.default}
        {...(verifiedState ? styleScheme.verified : {})}
        {...props}
      >
        <ButtonText verified={verifiedState}>
          {!verifiedState ? 'Book Now' : 'Ride has been booked'}
        </ButtonText>
      </RNSwipeVerify>
    </SliderContainer>
  );
};

export default Button;
