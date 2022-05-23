import styled from 'styled-components';
import { BaseText } from '../../../Components/BaseText';

export const ErrorText = styled.Text`
  color: #cc0d28;
  font-weight: 500;
  height: 20px;
  font-size: 14px;
  margin: 10px auto 0 auto;
`;

export const SafeView = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
`;

export const PageContainer = styled.View`
  flex: 1;
  padding: 30px;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
`;

export const ResendContainer = styled.Text`
  width: 100%;
  text-align: center;
  margin-top: 50px;
`;

export const ResendText = styled(BaseText)`
`;

export const ResendButton = styled(BaseText)`
  text-decoration: underline;
`;

export const ImageContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
export const Name = styled(BaseText)`
  font-size: 20px;
  margin: 10px;
`;
