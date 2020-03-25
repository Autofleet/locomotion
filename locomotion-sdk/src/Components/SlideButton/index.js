import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import styled from 'styled-components';
import RNSwipeVerify from 'react-native-swipe-verify';
import LinearGradient from '../LinearGradient';
import i18n from '../../I18n';
import { inputHeight, appPalette } from '../../assets/style-settings';

const arrowIcon = require('../../assets/slider-arrow.png');
const checkIcon = require('../../assets/check.png');

const SliderContainer = styled.View`
  border-radius: 24px;
  height: 50px;
  width: 100%;
`;

const ButtonText = styled.Text`
  color: ${({ verified }) => (!verified ? '#08355c' : '#ffffff')};
   ${({ verified }) => (verified ? 'margin-right: 20px' : '')};
`;

export const DrawerButtonContainer = styled.View`
  padding-top: 10px;
  padding-bottom: 20px;
  margin: 0 auto;
  min-height: 40px;
  width: 70%;
`;

const styleScheme = {
  default: {
    buttonSize: 50,
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
  const loaderRef = useRef();
  const onPressWithLoading = async (args) => {
    setLoadingState(true);
    await onVerified();
    return setLoadingState(false);
  };

  useEffect(() => {
    setLoading(loadingState);
  }, [loadingState]);
  return (
    <DrawerButtonContainer>
      <SliderContainer>
        <RNSwipeVerify
          ref={ref => sliderRef.current = ref}
          okButton={{ visible: true, duration: 400 }}
          onVerified={async () => {
            try {
              await onPressWithLoading();
              setVerifiedState(true);
            } catch (e) {
              sliderRef.current.reset();
            }
          }}
          icon={!loadingState ? (
            <Image
              source={!verifiedState ? arrowIcon : checkIcon}
              style={{ width: 30, height: 30 }}
            />
          ) : (
            <LottieView
              style={{
                width: 50,
                height: 50,
              }}
              autoPlay
              loop
              source={require('./loader.json')}
            />

          )}
          {...styleScheme.default}
          {...(verifiedState ? styleScheme.verified : {})}
          {...props}
        >
          <ButtonText verified={verifiedState}>
            {!verifiedState ? i18n.t('home.offerCard.confirmOffer') : i18n.t('home.offerCard.offerBooked')}
          </ButtonText>
        </RNSwipeVerify>
      </SliderContainer>
    </DrawerButtonContainer>
  );
};

export default Button;
