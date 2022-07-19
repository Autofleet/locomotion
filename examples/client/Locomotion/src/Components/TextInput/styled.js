import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

import { ERROR_COLOR } from '../../context/theme';

const bottomBorderStyles = `
border-bottom-color: #e2e2e2;
border-bottom-width: 1px;
`;

const fullBorderStyles = isFocused => `
backgroundColor: #f1f2f6;
borderRadius: 8px;
${isFocused && `
    border-width: 1px
    border-color: #333333
`};

`;

export const Input = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.theme.disabledColor,
}))`
    width: 100%;
    padding: 0px 8px;
    height: 40px;
    width: ${({ width }) => (width || '100%')};
    ${({ fullBorder, isFocused }) => (fullBorder ? fullBorderStyles(isFocused) : bottomBorderStyles)}
    border-color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
    color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
`;

export const BottomSheetInput = styled(BottomSheetTextInput)`
  padding: 0px 8px;
  padding-right: 30;
  height: 40px;
  ${({ fullBorder, isFocused }) => (fullBorder ? fullBorderStyles(isFocused) : bottomBorderStyles)}
  border-color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
  color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
  flex: 1;
`;

export const BottomSheetInputContainer = styled(View)`
  flex-direction: row;
`;

export const IconContainer = styled(View)`
  position: absolute;
  right: -2;
  top: -2;
  padding: 16px;
  z-index: 1;
`;

export const TouchableIconContainer = styled.TouchableOpacity`
`;
