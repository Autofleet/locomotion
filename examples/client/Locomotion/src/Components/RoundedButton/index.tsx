import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components/native';
import { ButtonTextContainer, StyledButton, SubmitButtonText } from './styled';
import SvgIcon from '../SvgIcon';

interface ButtonProps {
  type?: string;
  hollow?: boolean;
  onPress: (args?: any) => void;
  disabled?: boolean;
  useCancelTextButton?: boolean;
  setLoading?: ((state: boolean) => void) | null;
  style?: any;
  icon?: any;
  children?: any;
  testID?: string;
}

const RoundedButton = ({
  onPress,
  style = {},
  hollow = false,
  setLoading = null,
  disabled = false,
  type = 'confirm',
  useCancelTextButton = false,
  icon = null,
  children = null,
  testID = '',
  ...props
}: ButtonProps) => {
  const [loadingState, setLoadingState] = useState(false);
  const theme = useTheme();

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
      testID={testID}
      {...props}
      onPress={onPressWithLoading}
      hollow={hollow}
      disabled={(loadingState || disabled)}
      isLoading={loadingState}
      type={type}
      style={style}
      useCancelTextButton={useCancelTextButton}
      withIcon={!!icon}
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
      <ButtonTextContainer withIcon={!!icon}>
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

export default RoundedButton;
