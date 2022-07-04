import styled from 'styled-components';

import { ERROR_COLOR } from '../../context/theme';


export const IconContainer = styled.View`
  position: absolute;
  right: 15;
  top: 15;
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
