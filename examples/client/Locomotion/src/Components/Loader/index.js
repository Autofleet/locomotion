import React from 'react';
import styled from 'styled-components';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import darkLoader from '../../assets/loaders/dark-loader.json';
import lightLoader from '../../assets/loaders/light-loader.json';
import sliderLoader from '../../assets/loaders/slider-loader.json';

const LoadingWrapper = styled.View`
  width: 100%;
  align-items: center;
`;

const Loader = ({
  inSlider = false, dark, lottieViewStyle, sourceProp,
}) => {
  const Wrapper = inSlider ? View : LoadingWrapper;
  let source;
  if (inSlider) {
    source = sliderLoader;
  } else {
    source = dark ? darkLoader : lightLoader;
  }

  return (
    <Wrapper>
      <LottieView
        style={lottieViewStyle || undefined}
        ref={(animation) => {
          if (animation) {
            animation.play();
          }
        }}
        source={sourceProp || source}
        autoPlay
        loop
      />
    </Wrapper>
  );
};

export default Loader;
