import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Image } from 'react-native';
import RNSwipeVerify from 'react-native-swipe-verify';
import i18n from '../../I18n';
import Loader from '../Loader';
import { Context as ThemeContext } from '../../context/theme';
import {
  ButtonText, DrawerButtonContainer, SliderContainer, styleSchemed,
} from './styled';

const arrowIcon = require('../../assets/slider-arrow.png');
const checkIcon = require('../../assets/check.png');

const Button = ({
  children, style, hollow, setLoading, onVerified, text, verifiedText, ...props
}) => {
  const theme = useContext(ThemeContext);
  const styleScheme = styleSchemed(theme);
  const [loadingState, setLoadingState] = useState(false);
  const [verifiedState, setVerifiedState] = useState(false);
  const sliderRef = useRef();

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
            <Loader
              inSlider
              lottieViewStyle={{
                width: 50,
                height: 50,
              }}
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
