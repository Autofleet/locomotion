import Button from '../../../Components/Button';
import styled from 'styled-components';
import { BaseText } from '../../../Components/BaseText';
import { ERROR_COLOR, FONT_STYLES } from '../../../services/sharedStyles';

export const ErrorText = styled.Text`
  color: ${ERROR_COLOR};
  font-size: ${FONT_STYLES.SIZE.SMALL};
  margin-top: 15px;
  width: 80%;
  text-align: center;
  align-self: center;
`;

export const SafeView = styled.SafeAreaView`
flex: 1;
background-color: white;
`;

export const PageContainer = styled.View`
flex: 1;
padding: 35px 30px;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
`;

export const ResendContainer = styled.Text`
width: 100%;
text-align: center;
margin-top: 50px;
opacity: .7;
`;

export const ResendText = styled(BaseText)`
color: #707070;
`;

export const ResendButton = styled(BaseText)`
  text-decoration: underline;
  ${({ theme }) => `
  text-decoration-color: ${theme.primaryColor};
  color: ${theme.primaryColor};
  `}
`;

export const ImageContainer = styled.View`
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
`;
export const Name = styled(BaseText)`
font-size: ${FONT_STYLES.SIZE.EXTRA_LARGE};
margin: 20px;
font-weight: 600;
`;

export const SkipButton = styled(Button)`
color: #24aaf2;
font-size: ${FONT_STYLES.SIZE.MEDIUM};
`;