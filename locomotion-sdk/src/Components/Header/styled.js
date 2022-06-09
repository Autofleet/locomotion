import styled from 'styled-components';
import Button from '../Button';

export const HeaderView = styled.View`
  align-self: flex-start;
  margin-top: 14px;
  margin-left: 20px;
  shadow-offset: 0px 0px;
  shadow-color: #04214f;
  shadow-opacity: 0.4;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
  padding: 5px;
  border-radius: 8px;

  ${({ menuSide }) => (menuSide === 'right' ? `
  align-self: flex-end;
  margin-right: 14px;
  margin-left: 0;
  ` : '')}
`;

export const ButtonHeaderView = styled(Button)`
  background-color: unset;
`;
