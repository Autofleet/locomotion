import styled from 'styled-components';
import Button from '../Button';

export const HeaderText = styled.Text`
  color: ${({ theme }) => theme.textColor};
  font-weight: bold;
  text-align: center;
  font-size: 16px;
`;

export const HeaderIconContainer = styled(Button)(({ side, theme }) => `
  padding: 5px;
  position: absolute;
  top: 6px;

  right: ${side === 'right' ? 0 : null};
  margin-right: ${side === 'right' ? 30 : null};

  left: ${side === 'left' ? 0 : null};
  margin-left: ${side === 'left' ? 13 : null};

  background-color: ${theme.pageBackgroundColor};
`);

export const HeaderIcon = styled.Image`
  width: ${({ width }) => (width || '18px')};
  height: ${({ height }) => (height || '18px')};
`;

export const Header = styled.View`
  padding: 15px;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
  width: 100%;
  box-shadow: 0px 5px 3px rgba(68, 68, 68, 0.1);
`;
