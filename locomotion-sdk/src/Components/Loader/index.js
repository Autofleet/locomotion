import React from 'react';
import styled from "styled-components";
import LottieView from 'lottie-react-native';
import darkLoader from "../../assets/dark-loader.json";
import lightLoader from "../../assets/loader.json";
import sliderLoader from "../../assets/slider-loader.json";
import {View} from "react-native";

const LoadingWrapper = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 3px;
`;

const Loader = ({ inSlider = false, dark, lottieViewStyle }) => {
  const Wrapper = inSlider ? View : LoadingWrapper;
  let source;
  if (inSlider) {
    source = sliderLoader;
  }
  else {
    source = dark ? darkLoader : lightLoader;
  }

  return (
    <Wrapper>
      <LottieView
        style={lottieViewStyle || undefined}
        ref={(animation) => {
          this.animation = animation;
          if (animation) {
            animation.play();
          }
        }}
        source={source}
        autoPlay
        loop
      />
    </Wrapper>);
};

export default Loader;
