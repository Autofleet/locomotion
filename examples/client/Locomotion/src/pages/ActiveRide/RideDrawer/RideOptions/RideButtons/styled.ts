import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../context/theme';
import Button from '../../../../../Components/Button';
export const Container = styled(View)`
    margin: 0px 15px;
    display: flex;
    height: 150px;
`;

export const RowContainer = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    flex: 1;
    margin-bottom: 5px;
`;

export const ButtonContainer = styled(View)`
    flex-direction: row;
    border: 1px solid #f1f2f6;
    padding: 0 10px;
    border-radius: 8px;
    align-items: center;
    flex: 1;
    margin: 3px;
    height: 100%;
`;

export const TouchableOpacityContainer = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    height: 100%;
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
margin-top: 10px;
`;