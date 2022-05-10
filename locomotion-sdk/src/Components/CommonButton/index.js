import React, { useState } from 'react';
import LottieView from 'lottie-react-native';
import styled from 'styled-components';

import { inputHeight } from '../../assets/style-settings';
import Button from '../Button';

const LoadingWrapper = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 3px;
`;

const SubmitButtonText = styled.Text`
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  ${({hollow}) => hollow && `
    color: #b5b5b5;
  `}
`;

const buttonShadow = `
  shadow-opacity: 0.75;
  shadow-radius: 5px;
  shadow-color: #a7a7a7;
  shadow-offset: 0px 0px;
`;

const StyledTouchableOpacity = styled(Button)`
  width: ${({ width }) => (width || '100%')};
  background-color: #1e273d;
  height: 40px;
  ${({ marginTop }) => marginTop && `
    margin-top: ${marginTop};
  `}

  ${({hollow}) => hollow && `
    background-color: #ffffff;
    border: 2px solid #b5b5b5;
  `}
  flex-direction: row;
`;

const ButtonTextContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
`;

const CommonButton = styled(({
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
        <ButtonTextContainer>
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
              source={hollow ? require('./dark-loader.json') : require('./loader.json')}
            />
          </LoadingWrapper>
        ) : (
          <SubmitButtonText hollow={hollow}>
            {children}
          </SubmitButtonText>
        )}
      </ButtonTextContainer>
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

export default CommonButton;
