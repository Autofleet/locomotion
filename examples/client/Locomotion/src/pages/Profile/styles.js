import styled from 'styled-components';
import { BaseText } from '../../Components/BaseText';
import { ERROR_COLOR, FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import Button from '../../Components/Button';

export const BaseErrorText = styled.Text`
  color: ${ERROR_COLOR};
  ${FONT_SIZES.MEDIUM};
  ${FONT_WEIGHTS.MEDIUM};
  margin-top: 15px;
  width: 80%;
`;

export const ErrorText = styled(BaseErrorText)`
  text-align: center;
  align-self: center;
`;

export const SafeView = styled.SafeAreaView`
flex: 1;
background-color: white;
`;

export const ResendContainer = styled.Text`
width: 100%;
text-align: center;
margin-top: 50px;
opacity: .7;
`;

export const ResendText = styled(BaseText)`
color: #707070;
${FONT_SIZES.LARGE};
${FONT_WEIGHTS.REGULAR}
`;

export const ResendButton = styled(BaseText)`
  text-decoration: underline;
  ${FONT_SIZES.LARGE};
  ${FONT_WEIGHTS.REGULAR};
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
${FONT_SIZES.H1};
${FONT_WEIGHTS.BOLD};
margin: 20px;
max-width: 55%;
`;

export const InputContainer = styled.View`
  margin: 15px auto;
  width: 100%
`;
