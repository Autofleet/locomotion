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
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
  text-align: center;
  ${({hollow}) => hollow && `
    color: #1e273d;
  `}
`;

const buttonShadow = `
  shadow-opacity: 0.75;
  shadow-radius: 5px;
  shadow-color: #a7a7a7;
  shadow-offset: 0px 0px;
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  width: ${({ width }) => (width || '100%')};
  border-radius: 24px;
  padding-top: 8px;

  background-color: #1e273d;
  height: 40px;
/*   ${buttonShadow}
 */  ${({ marginTop }) => marginTop && `
    margin-top: ${marginTop};
  `}

  ${({hollow}) => hollow && `
    background-color: #ffffff;
    border: 2px solid #1e273d;
  `}
`;

const Button = styled(({
  onPress, children, style, hollow, ...props
}) => {
  const [loadingState, setLoadingState] = useState(false);

  const onPressWithLoading = async (args) => {
    setLoadingState(true);
    await onPress(args);
    return setLoadingState(false);
  };

  return (
    <StyledTouchableOpacity width={style[0].width} {...props} onPress={onPressWithLoading} hollow={hollow}>
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
          <SubmitButtonText hollow={hollow}>
            {children}
          </SubmitButtonText>
        )}

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
