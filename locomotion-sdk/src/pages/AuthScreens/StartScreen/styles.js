import styled from 'styled-components';
import { FONT_STYLES } from '../../../services/sharedStyles';
import Button from '../../../Components/Button';

export const PageContainer = styled.View`
align-items: center;
display: flex;
flex-direction: column;
flex: 1;
width: 100%;
padding: 30px;
`;
export const ButtonsContainer = styled.View`
display: flex;
flex-direction: column;
width: 100%;
margin-bottom: 50px;
`;
export const InfoContainer = styled.View`
flex: 1;
width: 100%;
align-items: center;
display: flex;
flex-direction: column;
justify-content: center;
`;

export const LogoContainer = styled.View`
height: 80px;
width: 140px;
`;

export const Logo = styled.Image`
  width: 100%;
  height: undefined;
  aspect-ratio: 1.8;
`;

export const OperationName = styled.Text`
font-size: 40;
font-weight: 500;
color: #333333;
`;

export const OperationSubName = styled.Text`
font-size: 20;
opacity: .6;
color: #333333;
`;

export const StartButton = styled(Button)`
  margin: 10px 0;
  height: 50px;
  border-radius: 8px;
  ${({ theme, dark }) => `
    background-color: ${dark ? theme.primaryColor : 'white'};
    ${!dark ? `border: 2px solid ${theme.primaryColor}` : ''};
  `}
`;

export const ButtonText = styled.Text`
  color: ${({ dark }) => (dark ? '#ffffff' : '#333333')};
  font-size: ${FONT_STYLES.SIZE.LARGE};
  margin: auto;
`;
  // color: ${({ theme }) => theme.primaryButtonTextColor};

export const TermsText = styled.Text`
  color: ${({ theme }) => theme.textColor};
  font-size: ${FONT_STYLES.SIZE.SMALL};
  text-align: center;
  width: 200px;
`;

export const TermsLink = styled.Text`
  font-size: ${FONT_STYLES.SIZE.SMALL};
  text-align: center;
  font-weight: 500;
  color: ${({ theme }) => theme.primaryColor};
  padding: 2px;
  text-decoration: underline;
  text-decoration-color:  #8ab4f8;
  &:active {
    color: red;
  }
`;
