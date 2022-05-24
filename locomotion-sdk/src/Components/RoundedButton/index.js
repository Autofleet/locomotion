import React, { useEffect, useState } from 'react';
import propsTypes from 'prop-types';
import Loader from '../Loader';
import { ButtonTextContainer, StyledButton, SubmitButtonText } from './styled';

const RoundedButton = ({
  onPress,
  children,
  style,
  hollow,
  setLoading,
  disabled,
  type,
  useCancelTextButton,
  ...props
}) => {
  const [loadingState, setLoadingState] = useState(false);

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
    <StyledButton
      {...props}
      onPress={onPressWithLoading}
      hollow={hollow}
      disabled={(loadingState || disabled)}
      type={type}
      useCancelTextButton={useCancelTextButton}
    >
      <ButtonTextContainer>
        {loadingState ? (
          <Loader
            dark={hollow}
            lottieViewStyle={{
              width: 80,
              height: 12,
            }}
          />
        ) : (
          <SubmitButtonText
            hollow={hollow}
            type={type}
            useCancelTextButton={useCancelTextButton}
          >
            {children}
          </SubmitButtonText>
        )}
      </ButtonTextContainer>
    </StyledButton>
  );
};

RoundedButton.defaultProps = {
  type: 'confirm',
  hollow: false,
  onPress: () => null,
  disabled: false,
  useCancelTextButton: false,
};

RoundedButton.propTypes = {
  type: propsTypes.string,
  hollow: propsTypes.bool,
  onPress: propsTypes.func,
  disabled: propsTypes.bool,
  useCancelTextButton: propsTypes.bool,
};

export default RoundedButton;
