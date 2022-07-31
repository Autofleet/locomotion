import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

export const CreditCardRowContainer = styled.View`
width: 300px;
                  margin-top: 20px;
                  margin-bottom: 10px;
                  padding: 10px;
                  border-color: #f1f2f6;
                  border-style: solid;
                  border-width: 1px;
`;

export const PriceItemsContainer = styled.View`
width: 90%;
margin-left: 15px;
margin-right: 5px;
`;

export const EstimationContainer = styled.View`
padding: 10px;
background-color: #f8f8f8;
width: 300px;
`;

export const EstimationText = styled.Text`
${FONT_SIZES.MEDIUM};
${FONT_WEIGHTS.LIGHT}
`;
