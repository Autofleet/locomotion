import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import plusImage from '../../assets/plus.png';

import { ERROR_COLOR, FONT_SIZES } from '../../context/theme';

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
  editable: !props.disabled,
}))`
    width: 100%;
    padding: 0px 8px;
    height: 40px;
    width: ${({ width }) => (width || '100%')};
    ${({ fullBorder, isFocused }) => (fullBorder ? fullBorderStyles(isFocused) : bottomBorderStyles)}
    border-color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
    color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const BottomSheetInput = styled(BottomSheetTextInput)`
  padding: 0px 8px;
  height: 50px;
  max-width: ${({ isMultiSpEnabled }) => (isMultiSpEnabled ? '80%' : '100%')};
  ${({ isMultiSpEnabled }) => (!isMultiSpEnabled && 'padding-right: 30px;')}
  ${({ isMultiSpEnabled }) => (isMultiSpEnabled ? FONT_SIZES.LARGE : FONT_SIZES.H3)}
  ${({ fullBorder, isFocused }) => (fullBorder ? fullBorderStyles(isFocused) : bottomBorderStyles)}
  border-color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
  color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
  flex: 1;
  margin-right: ${({ dragIsRendered, clearIsRendered }) => ((dragIsRendered && !clearIsRendered) ? '12px' : '0px')};
`;


export const BottomSheetInputContainer = styled(View)`
  flex-direction: row;
`;

export const IconContainer = styled(View)`
  position: absolute;
  right: -2;
  top: 2;
  padding: 16px;
  z-index: 1;
`;

export const RemoveIconContainer = styled(View)`
  right: 0;
  top: 0;
  bottom: 0;
  margin-top: 16px;
  justify-content: center;
  z-index: 1;
`;

export const TouchableIconContainer = styled.TouchableOpacity`
  width: ${({ width }) => (width || '12px')};
  margin-left: ${({ marginLeft }) => (marginLeft || '-20px')};
`;

export const DragTouchableIconContainer = styled.TouchableOpacity`
  width: 12px;
  padding-right: 20px;
  padding-left: 5px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-left: 4px;
  
`;
export const PlusIcon = styled.Image.attrs({ source: plusImage })`
    width: 15px;
    height: 15px;
`;
export const AddSpContainer = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: #f1f2f6;
    margin-top: ${({ hasEnteredMultiSp }) => (!hasEnteredMultiSp ? '-24px' : '6px')};
    justify-content: center;
    align-items: center;
    margin-left: 10px;
`;

export const DragIconContainer = styled(View)`
  
`;
export const TextDragCloseContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: #f1f2f6;
  max-width: ${({ isMultiSpEnabled }) => (isMultiSpEnabled ? '80%' : '90%')};
  ${FONT_SIZES.H3}
  ${({ fullBorder, isFocused }) => (fullBorder ? fullBorderStyles(isFocused) : bottomBorderStyles)}
  border-color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
  color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
`;
