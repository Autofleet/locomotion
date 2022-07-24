import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import Button from '../Button';

const HEADER_PADDING = 15;
export const HeaderText = styled.Text`
  color: ${({ theme }) => theme.textColor};
  text-align: center;
  position: absolute;  
  width: 100%;
  padding: ${HEADER_PADDING}px;
  ${FONT_SIZES.H3}
  ${FONT_WEIGHTS.SEMI_BOLD}
`;

export const HeaderIconContainer = styled(Button)(({ side, theme }) => `
  padding: ${HEADER_PADDING}px;
  zIndex: 999;
  right: ${side === 'right' ? 0 : null};

  left: ${side === 'left' ? 0 : null};

  background-color: ${theme.pageBackgroundColor};
`);

export const HeaderIcon = styled.Image`
  width: ${({ width }) => (width || '18px')};
  height: ${({ height }) => (height || '18px')};
`;

export const Header = styled.View`
  background-color: ${({ theme }) => theme.pageBackgroundColor};
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  elevation: 10;
  box-shadow: 0px 5px 5px rgba(0,0,0,0.05);
  z-index: 999;
`;

export const SkipButton = styled(Button)`
padding: ${HEADER_PADDING}px;
`;

export const SkipButtonText = styled.Text`
  color: #24aaf2;
  ${FONT_SIZES.H3}
  ${FONT_WEIGHTS.SEMI_BOLD}
`;
