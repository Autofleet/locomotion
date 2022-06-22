import styled from 'styled-components';
import Button from '../Button';

export const HeaderView = styled.View`
  shadow-offset: 0px 0px;
  shadow-color: #04214f;
  shadow-opacity: 0.4;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
  border-radius: 8px;
  width: 40px;
  height: 40px;
  align-items: center;
  display: flex;
  justify-content: center;

  ${({ menuSide }) => (menuSide === 'right' ? `
  align-self: flex-end;
  margin-right: 14px;
  margin-left: 0;
  ` : '')}
`;

export const ButtonHeaderView = styled(Button)`
  background-color: unset;
`;

export const Container = styled.View`
padding: 10px 20px;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;
