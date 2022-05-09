import styled from 'styled-components';
import { padding, inputHeight } from '../../assets/style-settings';
import Button from '../../Components/Button';

const loginTextColor = '#7c8799';

export const ResendButton = styled(Button)`
  margin: 0 auto 0 auto;
`;

export const ResendButtonText = styled.Text`
  color: ${loginTextColor};
  text-decoration: underline;
  text-decoration-color: ${loginTextColor};
  margin: 0 auto 0 auto;
`;

export const Container = styled.View`
  background-color: white;
  height: 100%;
  color: ${loginTextColor};
  /* margin-top: 100px; */
  text-align: center;
  align-items: center;
  padding: ${padding};
`;

export const Text = styled.Text`
  color: ${loginTextColor};
  /* margin-bottom: 50px; */
`;

export const ErrorText = styled.Text`
  color: #cc0d28;
  /* margin-top: 10px; */
  font-weight: 500;
  height: 20px;
  font-size: 14px;
  margin: 10px auto 0 auto;
`;

export const TextInput = styled.TextInput`
  background-color: white;
  width: 100%;
  height: ${inputHeight};
`;

export const IntoTextContainer = styled.View`
  background-color: white;
  max-height: 100px;
  max-width: 300px;
  color: ${loginTextColor};
  align-items: center;
  margin-bottom: 25px;
  margin: 0 auto;
`;

export const IntroText = styled(Text)`
  text-align: center;
  font-size: 14px;
  line-height: 24;
`;

export const SubmitContainer = styled.View`
  width: 90%;
  margin-bottom: 70px;
  bottom: 0;
  position: absolute;

`;

export const TermsText = styled.Text`
  color: ${loginTextColor};
  font-size: 11px;
  text-align: center;
`;

export const TermsLink = styled.Text`
  font-size: 10px;
  text-align: center;
  font-weight: 500;
  color: #000000;
  padding: 2px;
  line-height: 16;

  &:active {
    color: red;
  }
`;
