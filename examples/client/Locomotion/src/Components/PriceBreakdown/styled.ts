import { Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

export const Title = styled(Text)`
  ${FONT_SIZES.MEDIUM};
  ${FONT_WEIGHTS.SEMI_BOLD};
  padding: 8px 0;
`;

export const Row = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
`;

export const ItemText = styled(Text)`
  ${FONT_SIZES.MEDIUM};
  ${FONT_WEIGHTS.LIGHT};
  opacity: 0.7;
  text-transform: capitalize;
`;

export const PriceText = styled(Text)`
  ${FONT_SIZES.MEDIUM};
  ${FONT_WEIGHTS.LIGHT};
  opacity: 0.7;
`;

export const CenteredItemText = styled(ItemText)`
  text-align: center;
  margin: 10px;
`;

export const Line = styled(View)`
  border: 0.5px solid #e6e6e6;
  width: 100%;
  margin: 0 5px;
`;

export const InnerContainer = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 16px;
`;
