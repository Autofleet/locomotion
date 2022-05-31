import { FONT_STYLES } from '../../services/sharedStyles';
import styled from 'styled-components';
import Button from '../Button';

const HEADER_PADDING = 15
export const HeaderText = styled.Text`
  color: ${({ theme }) => theme.textColor};
  font-weight: bold;
  text-align: center;
  font-size: 16px;
  position: absolute;
  width: 100%;
  padding: ${HEADER_PADDING}px;
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
  box-shadow: 0px 5px 3px rgba(68, 68, 68, 0.1);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
`;

export const SkipButton = styled(Button)`
padding: ${HEADER_PADDING}px;
`;

export const SkipButtonText = styled.Text`
color: #24aaf2;
font-size: ${FONT_STYLES.SIZE.MEDIUM};
font-weight: 800;
`;