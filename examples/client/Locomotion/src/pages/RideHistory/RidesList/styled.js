import React from 'react';
import styled from 'styled-components';
import activitiy from '../../../assets/activitiy.png';
import I18n from '../../../I18n';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../context/theme';

export const NoRidesImage = styled.Image.attrs({
  source: activitiy,
  resizeMode: 'cover',
})`
  width: 176px;
  height: 120.3px;
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
  ${({ addTop: top }) => top && 'margin-top: 50%;'}
  align-self: center;
`;

export const BaseText = styled.Text`
  padding-top: 5px
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

export const NoRidesInList = ({ yet }) => (
  <CenterContainer addTop>
    <NoRidesImage />
    {yet ? (
      <>
        <NoRidesListContainer>
          {I18n.t('rideHistory.noActivityYet')}
        </NoRidesListContainer>
        <SubNoRidesListContainer>
          {I18n.t('rideHistory.noActivitySub')}
        </SubNoRidesListContainer>
      </>
    ) : (
      <NoRidesListContainer>
        {I18n.t('rideHistory.noActivity')}
      </NoRidesListContainer>
    )}
  </CenterContainer>
);

export const DayTitleText = styled(BaseText)`
  font-size: 16px;
  text-transform: capitalize;
`;

export const RidesViewContainer = styled.View`
`;
