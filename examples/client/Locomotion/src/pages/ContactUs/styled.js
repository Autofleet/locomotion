import styled from 'styled-components';
import { LogoContainer } from '../AuthScreens/StartScreen/styles';
import SafeView from '../../Components/SafeView';
import Button from '../../Components/Button';
import SvgIcon from '../../Components/SvgIcon';
import { Text } from '../Profile/ScreenText/styles';

export const LearnMoreIcon = styled(SvgIcon)`
margin-top: 10px;
transform: rotate(135deg);
`;

export const LearnMoreButton = styled(Button)`
  min-width: 100%;
  padding-left: 110px;
  flex-direction: row;
  background-color: white;
`;

export const LearnMoreText = styled(Text)`
margin-right: 10px;
`;

export const ContactUsPageView = styled(SafeView)`
height: 100%;
width: 100%;
`;

export const ContactUsPageLogoContainer = styled(LogoContainer)`
max-height: 200px;
`;
