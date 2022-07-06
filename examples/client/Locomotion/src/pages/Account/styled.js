import styled from 'styled-components';
import Button from '../../Components/Button';
import ArrowIconSource from '../../assets/arrowright.png';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

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
  padding-left: 5px;
`;

export const LogoutContainer = styled(Button)`
  text-align: center;
  align-items: center;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
  padding: 20px;
`;

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
  padding-top: 5px;
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 5px;
  background-color: ${({ unverified }) => (unverified ? '#f35657' : '#2dc36a')};
`;

export const ArrowContainer = styled.View`
  flex-direction: row;
  margin-right: 10px;
  margin-left: auto;
  vertical-align: center;
  justify-content: center;
  align-items: center;
`;

export const Arrow = styled.Image.attrs({ source: ArrowIconSource })`
  opacity: 0.4;
  width: 10px;
  height: 10px;
  padding: 5px 10px;
`;


export const CardsContainer = styled.View`
  width: 100%;
  height: auto;
`;

export const CardContantContainer = styled.View`
  width: 90%;
`;

export const CardTitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  vertical-align: center;
  padding-right: 10px;
`;

export const CardTitle = styled.Text`
  color: #333333;
  opacity: 0.8;
  align-self: center;
  vertical-align: center;
  padding-bottom: 5px;
  ${FONT_SIZES.LARGE};
  ${FONT_WEIGHTS.SEMI_BOLD}
`;

export const CardText = styled.Text`
  ${FONT_SIZES.H2};
  ${FONT_WEIGHTS.REGULAR};
  color: #333333;
  opacity: 0.8;

`;

export const CardContainer = styled.View`
  flex-direction: row;
  vertical-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #e2e2e2;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
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
  ${FONT_SIZES.H1};
  ${FONT_WEIGHTS.BOLD};
`;

export const AccountHeaderSubText = styled.Text`
  ${FONT_SIZES.H2};
  ${FONT_WEIGHTS.SEMI_BOLD};
`;

export const AccountHeaderIndicatorContainer = styled.View`
  flex-direction: row;
  vertical-align: center;
`;
