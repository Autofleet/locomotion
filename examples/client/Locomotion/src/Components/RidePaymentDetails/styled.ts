import { Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

export const PaymentRow = styled(View)`
    flex-direction: row;
`;

export const ViewDetails = styled(Text)`
    ${FONT_SIZES.LARGE};
    ${FONT_WEIGHTS.BOLD}
    color: #24aaf2;
    text-decoration: underline;
    text-decoration-color: #24aaf2;
`;

export const PriceText = styled(Text)`
    ${FONT_SIZES.LARGE};
    ${FONT_WEIGHTS.MEDIUM}
`;

export const RidePriceDetails = styled(View)`
    flex: 1.5;
    justify-content: center;
    align-items: flex-end;
`;

export const CardRowContainer = styled(View)`
    flex: 3;
`;
