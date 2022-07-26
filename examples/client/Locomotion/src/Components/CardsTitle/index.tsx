import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

type StyledCardsTitleInterface = {
  noPaddingLeft: boolean;
}

const StyledCardsTitle = styled(Text)<StyledCardsTitleInterface>`
  width: 100%;
  ${FONT_SIZES.LARGE};
  ${FONT_WEIGHTS.BOLD};
  color: #333333;
  padding: ${({ noPaddingLeft }) => (noPaddingLeft ? '30px 0px 5px' : '30px 15px 5px')};
`;

const CardsTitle = ({
  title,
  noPaddingLeft,
}: {
    title: string,
    noPaddingLeft?: boolean,
}) => <StyledCardsTitle noPaddingLeft={noPaddingLeft}>{title}</StyledCardsTitle>;

export default CardsTitle;

CardsTitle.defaultProps = {
  noPaddingLeft: false,
};
