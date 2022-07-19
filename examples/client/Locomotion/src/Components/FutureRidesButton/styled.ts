import { Text } from 'react-native';
import styled from 'styled-components';
import Button from '../Button';
import { FONT_SIZES } from '../../context/theme';


export const Container = styled(Button)`
width: 45%;
display: flex;
flex-direction: row;
justify-content: flex-start;
height: 40px;
padding: 10px;
background-color: #ffffff;
border-radius: 8px;
align-items: center;
shadow-offset: 0px 0px;
shadow-color: #04214f;
shadow-opacity: 0.4;
elevation: 3;
`;

export const UpcomingText = styled(Text)`
${FONT_SIZES.LARGE};
max-width: 80%;
`;
