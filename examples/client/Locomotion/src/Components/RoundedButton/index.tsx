import React, { useEffect, useState } from 'react';
import propsTypes from 'prop-types';
import Loader from '../Loader';
import { ButtonTextContainer, StyledButton, SubmitButtonText } from './styled';

interface ButtonProps {
  type?: string;
  hollow?: boolean;
  onPress: (args?: any) => void;
  disabled?: boolean;
  useCancelTextButton?: boolean;
  setLoading?: (state: boolean) => void;
  style?: any;
  children?: any;
}

const RoundedButton = ({
  onPress,
  style,
  hollow,
  setLoading,
  disabled,
  type,
  useCancelTextButton,
  ...props
}: ButtonProps) => {
  const [loadingState, setLoadingState] = useState(false);

  const onPressWithLoading = async (args: any) => {
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
      isLoading={loadingState}
      type={type}
      style={style}
      useCancelTextButton={useCancelTextButton}
    >
      <ButtonTextContainer>
        <SubmitButtonText
          hollow={hollow}
          disabled={disabled}
          type={type}
          useCancelTextButton={useCancelTextButton}
        >
          {props.children}
        </SubmitButtonText>
      </ButtonTextContainer>
    </StyledButton>
  );
};

RoundedButton.defaultProps = {
  type: 'confirm',
  hollow: false,
  disabled: false,
  useCancelTextButton: false,
  setLoading: null,
  style: {},
  children: null,
};

export default RoundedButton;
