import styled from 'styled-components';
import Button from '../Button';

export const HeaderView = styled.View`
  align-self: flex-start;
  margin-top: 14px;
  margin-left: 14px;

  ${({menuSide}) =>
    menuSide === 'right'
      ? `
  align-self: flex-end;
  margin-right: 14px;
  margin-left: 0;
  `
      : ''}
`;

export const ButtonHeaderView = styled(Button)`
  background-color: unset;
`;
