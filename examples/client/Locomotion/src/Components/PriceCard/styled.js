import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

export const PriceCardContainer = styled.View`
  flex-direction: row;
  margin: 5px 0 5px 15px
  width: 300px;
  justify-content: space-between;
   `;

export const PriceNameText = styled.Text`
${FONT_SIZES.LARGE};
${FONT_WEIGHTS.REGULAR};
opacity: .8;
   `;

export const PriceText = styled(PriceNameText)`
   text-align: right;
   `;

export const NoTitlePriceCardContainer = styled.View`
margin-left: 15px;
`
