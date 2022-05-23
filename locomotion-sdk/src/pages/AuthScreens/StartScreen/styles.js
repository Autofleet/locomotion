import styled from 'styled-components';
import Button from '../../../Components/Button';

export const PageContainer = styled.View`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  padding: 30px;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
`;
export const ButtonsContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 50px;
`;

export const Logo = styled.Image`
  margin: auto;
  height: 30%;
  width: 100%;
`;

export const StartButton = styled(Button)`
  margin: 10px 0;
  height: 50px;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.buttonBackgroundColor};
  color: ${({ theme }) => theme.primaryColor};
  ${({ theme }) => !theme.isDarkMode && 'border: 1px solid grey'};
  box-shadow: 0px 3px 3px grey;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.primaryColor};
  margin: auto;
`;

export const TermsText = styled.Text`
  color: ${({ theme }) => theme.textColor};
  font-size: 11px;
  text-align: center;
  width: 50%;
`;

export const TermsLink = styled.Text`
  font-size: 10px;
  text-align: center;
  font-weight: 500;
  color: ${({ theme }) => theme.textColor};
  padding: 2px;
  line-height: 16px;

  &:active {
    color: red;
  }
`;

export const LogoContainer = styled.View`
  flex: 1;
  width: 100%;
`;
