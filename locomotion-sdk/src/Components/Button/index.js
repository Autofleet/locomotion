import LottieView from 'lottie-react-native';
import styled from 'styled-components';
import React, { useState } from 'react';

import { inputHeight } from '../../assets/style-settings';

const LoadingWrapper = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 3px;
`;

const SubmitButtonText = styled.Text`
  color: white;
  text-align: center;
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  width: ${({ width }) => (width || '100%')};

`;

const Button = styled(({
  onPress, children, ...props
}) => {
  const [loadingState, setLoadingState] = useState(false);

  const onPressWithLoading = async (args) => {
    setLoadingState(true);
    await onPress(args);
    return setLoadingState(false);
  };
  return (
    <StyledTouchableOpacity {...props} onPress={onPressWithLoading}>
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
    </StyledTouchableOpacity>
  );
})`
  width: 100%;
  height: ${inputHeight};
  background-color: white;
  border-radius: 2px;
`;

export default Button;
