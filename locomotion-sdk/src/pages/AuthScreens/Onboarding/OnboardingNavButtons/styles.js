import { OPERATION_COLOR } from '../../../../services/sharedStyles';
import styled from 'styled-components';
import Button from '../../../../Components/Button';

export const NavButton = styled(Button)`
width: 100%;
height: 50px;
background-color: ${({ disabled }) => disabled ? '#bcbcbc' : OPERATION_COLOR};
border-radius: 8px;
margin-top: 40px;
`;

export const ButtonText = styled.Text`
margin: auto;
color: white;
font-size: 19px;
`;
