import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

const StyledCardsTitle = styled(Text)`
  width: 100%;
  ${FONT_SIZES.MEDIUM};
  ${FONT_WEIGHTS.BOLD};
  color: #333333;
  padding: 30px 0px 5px;
`;

const CardsTitle = ({
  title,
}: {
    title: string
}) => <StyledCardsTitle>{title}</StyledCardsTitle>;

export default CardsTitle;
