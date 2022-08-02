import styled from 'styled-components';
import { Dimensions } from 'react-native';
import { LogoContainer } from '../AuthScreens/StartScreen/styles';
import SafeView from '../../Components/SafeView';
import Button from '../../Components/Button';
import SvgIcon from '../../Components/SvgIcon';
import { Text } from '../Profile/ScreenText/styles';

export const LearnMoreIcon = styled(SvgIcon)`
transform: rotate(135deg);
`;

export const LearnMoreButton = styled(Button)`
  width: ${Dimensions.get('window').width - 30};
  flex-direction: row;
  background-color: white;
  justify-content: center;
  text-align: center;
  align-items: center;
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
max-width: 100%;
padding: 20px;
display: flex;
justify-content: center;
align-items: center;
background-color: white;
elevation: 10;
  box-shadow: 0px 5px 5px rgba(0,0,0,0.05);
z-index: 1;
`;

export const ContactUsLogo = styled.Image`
position: relative;
display: flex;
  
`;
