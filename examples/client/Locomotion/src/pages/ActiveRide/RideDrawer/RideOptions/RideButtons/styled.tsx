import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../context/theme';
import Button from '../../../../../Components/Button';

export const HALF_WIDTH = '48%';

export const Container = styled(View)`
    padding: 0 20px;
    padding-bottom: 48px;
    display: flex;
    height: 198px;
    background-color: white;
`;

export const RowContainer = styled(View)`
  flex-direction: row;
  width: 100%;
  height: 30%;
  margin-bottom: 2%;
  justify-content: space-between;
  display: flex;
  row-gap: 10;
`;

export const ButtonContainer = styled(Button).attrs({
  noBackground: true,
})`
    flex-direction: row;
    border: ${({ error }) => (error ? '1px solid #F83743' : '1px solid #f1f2f6')};
    border-radius: 8px;
    align-items: center;
    height: 100%;
    display: flex;
    width: ${HALF_WIDTH};
    padding: ${(({ padding }) => (padding || '0 15px'))};
`;

export const ButtonText = styled(Text)`
  margin: auto;
  color: ${({ theme }) => theme.primaryButtonTextColor};
  ${FONT_SIZES.H3};
  ${FONT_WEIGHTS.REGULAR};
`;

export const StyledButton = styled(Button)`
flex: 5;
height: 50px;
background-color: ${({ disabled, theme }) => (disabled ? '#bcbcbc' : theme.primaryColor)};
border-radius: 8px;
`;

export const PickerTitle = styled(Text)`
  ${FONT_SIZES.H1};
  ${FONT_WEIGHTS.SEMI_BOLD};
  margin-bottom: 25px;
`;

export const PickerDate = styled(Text)`
  ${FONT_SIZES.H3};
  ${FONT_WEIGHTS.LIGHT};
  margin-bottom: 7px;
`;

export const PickerTimeRange = styled(Text)`
  ${FONT_SIZES.H1};
`;

export const ButtonContainerWithError = styled(View)`
display: flex;
flex-direction: column;
height: 100%;
`;

export const ButtonContainerInError = styled(View)`
display: flex;
flex-direction: column;
height: 80%;
`;

export const ErrorText = styled(Text)`
  ${FONT_SIZES.MEDIUM};
  color: #F83743;
`;

export const ButtonWithError = ({ children, errorText }) => (
  <ButtonContainerWithError>
    <ButtonContainerInError>
      {children}
    </ButtonContainerInError>
    {errorText
    && (
    <ErrorText>
      {errorText}
    </ErrorText>
    )}
  </ButtonContainerWithError>
);
