import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import styled from 'styled-components';
import propsTypes from 'prop-types';
import LinearGradient from '../LinearGradient';

import { inputHeight, appPalette } from '../../assets/style-settings';

const COLORS = {
  confirm: {
    primary: {
      background: '#1e273d',
      text: '#ffffff'
    },
    hollow: {
      background: '#ffffff',
      border: '#b5b5b5',
      text: '#b5b5b5'
    }
  },
  cancel: {
    primary: {
      background: '#f03a5f',
      text: '#ffffff'
    },
    hollow: {
      background: '#ffffff',
      border: '#f03a5f',
      text: '#f03a5f'
    }
  }

}

const LoadingWrapper = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 3px;
`;

const SubmitButtonText = styled.Text`
  color: ${({ type }) => COLORS[type].primary.text};
  font-size: 14px;
  text-align: center;
  ${({ hollow, type, useCancelTextButton }) => (hollow || useCancelTextButton) && `
    color: ${!useCancelTextButton ? COLORS[type].hollow.text : COLORS.confirm.primary.background};
  `}
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  width: ${({ width }) => (width || '100%')};
  border-radius: 24px;
  background-color: ${({ type }) => COLORS[type].primary.background};
  height: ${({ height }) => (height || '40px')};

  ${({ marginTop }) => marginTop && `
    margin-top: ${marginTop};
  `}

  ${({ hollow, type, useCancelTextButton }) => (hollow || useCancelTextButton) && `
    background-color: ${COLORS[type].hollow.background};
    border: 2px solid ${!useCancelTextButton ? COLORS[type].hollow.border : 'transparent'};
  `}

  flex-direction: row;

  ${({ disabled }) => disabled && `
    opacity: 0.7;
  `}
`;

const ButtonTextContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
`;

const Button = ({ onPress, children, style, hollow, setLoading, disabled, type, useCancelTextButton, ...props  }) => {
  const [loadingState, setLoadingState] = useState(false);
  console.log();

  const onPressWithLoading = async (args) => {
    setLoadingState(true);
    await onPress(args);
    return setLoadingState(false);
  };

  useEffect(() => {
    if (setLoading) {
      setLoading(loadingState);
    }
  }, [loadingState]);

  return (
    <StyledTouchableOpacity {...props} onPress={onPressWithLoading} hollow={hollow} disabled={(loadingState || disabled)} type={type} useCancelTextButton={useCancelTextButton}>
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
          <SubmitButtonText hollow={hollow} type={type} useCancelTextButton={useCancelTextButton}>
            {children}
          </SubmitButtonText>
        )}
      </ButtonTextContainer>
    </StyledTouchableOpacity>
  );
}

export default Button;


Button.defaultProps = {
  type: 'confirm',
  hollow: false,
  onPress: () => null,
  disabled: false,
  useCancelTextButton: false
};

Button.propTypes = {
  type: propsTypes.string,
  hollow: propsTypes.bool,
  onPress: propsTypes.func,
  disabled: propsTypes.bool,
  useCancelTextButton: propsTypes.bool
};
