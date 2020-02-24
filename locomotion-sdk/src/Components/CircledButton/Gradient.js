import LottieView from 'lottie-react-native';
import styled from 'styled-components';
import React, { useState } from 'react';
import LinearGradient from '../LinearGradient';

import { inputHeight, appPalette } from '../../assets/style-settings';

const LoadingWrapper = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 3px;
`;

const SubmitButtonText = styled.Text`
  color: white;
  text-align: center;
`;

const buttonShadow = `
  shadow-opacity: 0.75;
  shadow-radius: 5px;
  shadow-color: #a7a7a7;
  shadow-offset: 0px 0px;
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  width: ${({ width }) => (width || '100%')};
  ${buttonShadow}
  background-color: red;
  margin-top: 25px;
`;

const Button = styled(({
  onPress, children, style, ...props
}) => {
  const [loadingState, setLoadingState] = useState(false);

  const onPressWithLoading = async (args) => {
    setLoadingState(true);
    await onPress(args);
    return setLoadingState(false);
  };

  return (
    <StyledTouchableOpacity width={style[0].width} {...props} onPress={onPressWithLoading}>
      <LinearGradient style={{...style, marginTop: 0, paddingTop: 15, paddingBottom: 15}} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={appPalette}>
        {loadingState ? (
          <LoadingWrapper>
            <LottieView
              style={{
                width: 80,
                height: 12,
              }}
              ref={(animation) => {
                this.animation = animation;
                if (animation) {
                  animation.play();
                }
              }}
              source={require('./loader.json')}
            />
          </LoadingWrapper>
        ) : (
          <SubmitButtonText>
            {children}
          </SubmitButtonText>
        )}
      </LinearGradient>
    </StyledTouchableOpacity>
  );
})`
  width: 100%;
  height: ${inputHeight};
  background-color: white;
  margin-top: 50px;
  padding-top: 15px;
  border-radius: 2px;
`;

export default Button;
