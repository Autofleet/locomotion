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
`;

export const ButtonContainer = styled(Button).attrs({
  noBackground: true,
})`
    background-color: ${({ highlight }) => (highlight ? '#d3eefc' : 'transparent')};
    flex-direction: row;
    border: 1px solid #f1f2f6;
    border-radius: 8px;
    align-items: center;
    height: 100%;
    display: flex;
    width: ${HALF_WIDTH};
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
