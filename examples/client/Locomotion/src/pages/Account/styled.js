import styled from 'styled-components';
import Button from '../../Components/Button';
import ArrowIconSource from '../../assets/arrowright.png';
import { ERROR_COLOR, FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

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

export const LogoutContainer = styled.View`
  text-align: center;
  align-items: center;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
  padding-top: 40px;
`;

export const LogoutText = styled.Text`
  ${FONT_SIZES.LARGE}
  color: #24aaf2;
  text-decoration: underline;
  text-decoration-color: #24aaf2;
`;

export const DeleteText = styled.Text`
  ${FONT_SIZES.LARGE}
  color: ${ERROR_COLOR};
  text-decoration: underline;
  text-decoration-color: ${ERROR_COLOR};
`;

export const VerifyContainer = styled.View`
  border-radius: 24px;
  padding-top: 5px;
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 5px;
  background-color: ${({ unverified }) => (unverified ? '#f35657' : '#2dc36a')};
`;

export const CardsContainer = styled.View`
  width: 100%;
  height: auto;
`;

export const CardContentContainer = styled.View`
  width: 90%;
`;

export const CardsTitle = styled.Text`
  width: 100%;
  ${FONT_SIZES.H3};
  ${FONT_WEIGHTS.BOLD};
  color: #333333;
  padding: 30px 10px 15px;
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

export const Type = styled.Text`
    ${FONT_SIZES.H2};
  ${FONT_WEIGHTS.REGULAR};
  color: #333333;
  opacity: 0.8;
  margin-left: 10px;
`;

export const PaymentMethodContent = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
