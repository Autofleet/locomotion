import styled from 'styled-components';
import { padding, inputHeight } from '../../assets/style-settings';

const loginTextColor = '#7c8799';

export const ResendButton = styled.Text`
  color: ${loginTextColor};
  text-decoration: underline;
  text-decoration-color: ${loginTextColor};
  margin-top: 20px;
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
  margin-top: 10px;
  font-weight: 500;
  height: 20px;
  font-size: 14px;
`;

export const TextInput = styled.TextInput`
  background-color: white;
  width: 100%;
  height: ${inputHeight};
`;
