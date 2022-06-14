import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../context/theme';
import Button from '../../../../Components/Button';

export const NavButton = styled(Button)`
width: 100%;
height: 50px;
background-color: ${({ disabled, theme }) => (disabled ? '#bcbcbc' : theme.primaryColor)};
border-radius: 8px;
margin-top: 40px;
`;

export const ButtonText = styled.Text`
  margin: auto;
  color: ${({ theme }) => theme.primaryButtonTextColor};
  ${FONT_SIZES.H3};
  ${FONT_WEIGHTS.REGULAR};
`;
