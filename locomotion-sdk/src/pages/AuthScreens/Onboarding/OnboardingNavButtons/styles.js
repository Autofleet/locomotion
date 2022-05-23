import styled from 'styled-components';
import Button from '../../../../Components/Button';

export const NavButton = styled(Button)`
  width: 100%;
  height: 50px;
  border-radius: 30px;
  margin-top: 20px;
`;

export const ButtonText = styled.Text`
  margin: auto;
  color: ${({ theme }) => theme.primaryButtonTextColor};
`;
