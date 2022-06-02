import styled from 'styled-components';
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
  background-color: #F9F9F9;
`;

export const LogoutContainer = styled.TouchableOpacity`
  width: 90%;
`;

export const Arrow = styled.Image.attrs({ source: ArrowIconSource })`
  opacity: 0.4;
  margin-right: 10px;
  margin-left: auto;
  width: 10px;
  height: 10px;
`;


export const CardsContainer = styled.View`
  width: 100%;
`;

export const CardContantContainer = styled.View`
`;

export const CardsTitle = styled.Text`
  width: 100%;
  font-size: 12px;
  font-weight: bold;
  padding: 30px 10px 15px;
`;

export const CardTitle = styled.Text`
  font-size: 12px;
`;

export const CardText = styled.Text`
  font-size: 16px;
`;

export const CardContainer = styled.TouchableOpacity`
  flex-direction: row;
  vertical-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px;
  border-bottom-width: 3px;
  border-bottom-color: #f9f9f9;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
`;

export const AccountHeaderContainer = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  padding: 20px 10px 0;
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
  color: ${({ theme }) => theme.primaryColor};
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
