import React, { useContext, useEffect, useState } from 'react';
import { ButtonTextContainer, StyledButton, SubmitButtonText } from './styled';
import SvgIcon from '../SvgIcon';
import { Context as ThemeContext } from '../../context/theme';

interface ButtonProps {
  type?: string;
  hollow?: boolean;
  onPress: (args?: any) => void;
  disabled?: boolean;
  useCancelTextButton?: boolean;
  setLoading?: (state: boolean) => void;
  style: any;
  icon: any;
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
  icon,
  children
  ...props
}: ButtonProps) => {
  const [loadingState, setLoadingState] = useState(false);
  const theme = useContext(ThemeContext);
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
      {icon && (
        <SvgIcon
          Svg={icon}
          width={15}
          height={15}
          fill={theme.primaryColor}
          style={{ margin: 10 }}
        />
      )}
      <ButtonTextContainer>
        <SubmitButtonText
          hollow={hollow}
          disabled={disabled}
          type={type}
          useCancelTextButton={useCancelTextButton}
        >
          {children}
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
  children: null,
};

export default RoundedButton;
