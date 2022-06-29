import React from 'react';
import { Text } from 'react-native';
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
    height: 40px;
    ${({ fullBorder, isFocused }) => (fullBorder ? fullBorderStyles(isFocused) : bottomBorderStyles)}
    border-color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
    color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
`;


export const InputIconContainer = styled.View`
    flex-direction: row;
    flex: 1;
    border-width: 1px;
    border-color: ${({ error }) => (error && error !== null ? ERROR_COLOR : 'transparent')};
    ${({ isFocused, error }) => (isFocused && !error) && 'border-color: #333333'};
    border-radius: 8px;
    background: #f1f2f6;

`;

export const InputIcon = styled.View`
    width: 40px;
    height: 40px;
    background: #f1f2f6;
    border-bottom-start-radius: 8px;
    border-top-start-radius: 8px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    justify-content: center;
`;

export const Icon = styled.Text`
    font-size: 18px;
    font-weight: 600;
    align-self: center;
`;
