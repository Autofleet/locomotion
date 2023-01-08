import { Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

export const Container = styled(View)`
background-color: #ffffff;
border-radius: 8px;
padding: 25px;
align-items: center;
`;

export const BodyContainer = styled(View)`
display: flex;
flex-direction: column;
width: 100%;
margin-top: 10px;
`;

export const CancellationReasonCard = styled(View)`
border-bottom-width: 1px;
border-color: #f1f2f6;
padding: 8px 3px;

&:last-child {
    border-bottom-width: 0px;
}
`;

export const CancellationReasonText = styled(Text)`
    color: #333333;
    ${FONT_SIZES.LARGE};
    ${FONT_WEIGHTS.REGULAR};
`;

export const LoaderContainer = styled(View)`
  height: 20px;
  width: 100%;
  margin: auto 0;
  margin-top: 25px;
`;

export const CloseButtonContainer = styled(View)`
  flex-direction: row;
  position: absolute;
  right: 10;
  top: 10;
`;

export const ClickableContainer = styled(TouchableOpacity)``;
