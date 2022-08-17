import styled from 'styled-components';
import Button from '../Button';
import ArrowIconSource from '../../assets/chevron.svg';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import SvgIcon from '../SvgIcon';

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

export const Arrow = styled(SvgIcon).attrs({
  Svg: ArrowIconSource,
  stroke: '#d7d7d7',
  width: 15,
  height: 15,
})``;


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

export const CardTitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  vertical-align: center;
  padding-right: 10px;
  max-width: 100%;
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

export const IconContainer = styled.View`
  padding: 15px;
`;
