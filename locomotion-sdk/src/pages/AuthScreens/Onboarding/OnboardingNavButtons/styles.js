import styled from 'styled-components';
import { FONT_STYLES, OPERATION_COLOR } from '../../../../services/sharedStyles';
import Button from '../../../../Components/Button';

export const NavButton = styled(Button)`
width: 100%;
height: 50px;
background-color: ${({ disabled }) => (disabled ? '#bcbcbc' : OPERATION_COLOR)};
border-radius: 8px;
margin-top: 40px;
`;

export const ButtonText = styled.Text`
margin: auto;
color: white;
font-size: ${FONT_STYLES.SIZE.LARGE};
`;
