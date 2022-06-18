import styled from 'styled-components';
import Button from '../../Components/Button';
import ArrowIconSource from '../../assets/arrowright.png';

export const ErrorText = styled.Text`
  color: #cc0d28;
  font-weight: 500;
  height: 20px;
  font-size: 14px;
  margin: 10px auto 0 auto;
`;

export const FullNameContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
`;

export const NameContainer = styled.View`
  width: 40%;
`;

export const SubmitContainer = styled.View`
  width: 90%;
`;

export const Container = styled.View`
  flex: 1;
  color: #7c8799;
  text-align: center;
  align-items: center;
  background-color: #f9f9f9;
  padding-left: 5px;
`;

export const LogoutContainer = styled(Button)``;

export const LogoutText = styled.Text`
  font-size: 14px;
  text-decoration: underline;
`;

export const VerifyText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 12px;
`;

export const VerifyContainer = styled.View`
  border-radius: 24px;
  padding: 5px 10px;
  margin-top: 5px;
  background-color: ${({unverified}) => (unverified ? '#f35657' : '#2dc36a')};
`;

export const ArrowContainer = styled.View`
  flex-direction: row;
  margin-right: 10px;
  margin-left: auto;
  vertical-align: center;
  justify-content: center;
  align-items: center;
`;

export const Arrow = styled.Image.attrs({source: ArrowIconSource})`
  opacity: 0.4;
  width: 10px;
  height: 10px;
  padding: 5px 10px;
`;

export const CardsContainer = styled.View`
  width: 100%;
`;

export const CardContantContainer = styled.View`
  width: 90%;
`;

export const CardsTitle = styled.Text`
  width: 100%;
  font-size: 12px;
  font-weight: bold;
  padding: 30px 10px 15px;
`;

export const CardTitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  vertical-align: center;
  padding-right: 10px;
`;

export const CardTitle = styled.Text`
  font-size: 14px;
  align-self: center;
  vertical-align: center;
  padding: 10px 0;
`;

export const CardText = styled.Text`
  font-size: 18px;
`;

export const CardContainer = styled.View`
  flex-direction: row;
  vertical-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px;
  border-bottom-width: 3px;
  border-bottom-color: #f9f9f9;
  background-color: ${({theme}) => theme.pageBackgroundColor};
`;

export const AccountHeaderContainer = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  padding: 20px 0 20px 20px;
`;

export const FlexCenterContainer = styled.View`
  vertical-align: center;
  align-self: center;
  justify-self: center;
`;

export const AccountHeaderMainContainer = styled(FlexCenterContainer)`
  padding: 15px;
  width: 50%;
`;

export const AccountHeaderMainText = styled.Text`
  color: ${({theme}) => theme.primaryColor};
  font-size: 22px;
  font-weight: bold;
`;

export const AccountHeaderSubText = styled.Text`
  font-size: 14px;
`;

export const AccountHeaderIndicatorContainer = styled.View`
  flex-direction: row;
  vertical-align: center;
`;
