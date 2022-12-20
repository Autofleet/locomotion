import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import noMessages from '../../assets/no_messages.svg';
import SvgIcon from '../SvgIcon';

export const NoRidesImageContainer = styled.View`
  align-self: center;
`;

export const RideViewContainer = styled.View`
  padding: 15px 5px;
  flex-direction: row;
  justify-content: space-between;
`;

export const RideViewTextContainer = styled.View`
  flex: 3;
`;

export const CenterContainer = styled.View`
  margin-top: ${({ addTop }) => (addTop ? '50%' : '0')};
  align-self: center;
  align-content: center;
`;

export const BaseText = styled.Text`
  padding-top: 5px;
`;

export const NoRidesListContainer = styled(BaseText)`
  padding-top: 45px;
  text-align: center;
  ${FONT_SIZES.H2}
  ${FONT_WEIGHTS.SEMI_BOLD}
`;
export const SubNoRidesListContainer = styled(BaseText)`
  padding-top: 15px;
  text-align: center;
  font-size: 16px;
`;

export const PageGenericMessage = ({
  title, text, svg = null, addTop = true,
}) => {
  const { primaryColor } = useContext(ThemeContext);
  return (
    <CenterContainer addTop={addTop}>
      <NoRidesImageContainer>
        <SvgIcon Svg={svg || noMessages} width={157} height={171} fill={primaryColor} />
      </NoRidesImageContainer>
      <NoRidesListContainer>
        {title}
      </NoRidesListContainer>
      <SubNoRidesListContainer>
        {text}
      </SubNoRidesListContainer>
    </CenterContainer>
  );
};

export const DayTitleText = styled(BaseText)`
  font-size: 16px;
  text-transform: capitalize;
`;

export const RidesViewContainer = styled.View`
`;


export default PageGenericMessage;
