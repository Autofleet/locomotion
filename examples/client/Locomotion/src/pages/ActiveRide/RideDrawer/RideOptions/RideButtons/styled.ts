import { Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../context/theme';
import Button from '../../../../../Components/Button';

export const Container = styled(View)`
    padding: 0 30px;
    margin-bottom: 5px;
    display: flex;
    height: 150px;
    background-color: white;
`;

export const RowContainer = styled(View)`
    flex-direction: row;
width: 100%;
height: 30%;
margin-bottom: 2%;
justify-content: space-between;
`;

export const ButtonContainer = styled(TouchableOpacity)`
    flex-direction: row;
    border: 1px solid #f1f2f6;
    border-radius: 8px;
    align-items: center;
    height: 100%;
    display: flex;
    width: 48%;
    padding: 0 15px;
`;

export const ButtonText = styled(Text)`
  margin: auto;
  color: ${({ theme }) => theme.primaryButtonTextColor};
  ${FONT_SIZES.H3};
  ${FONT_WEIGHTS.REGULAR};
`;

export const StyledButton = styled(Button)`
width: 100%;
height: 50px;
background-color: ${({ disabled, theme }) => (disabled ? '#bcbcbc' : theme.primaryColor)};
border-radius: 8px;
`;
