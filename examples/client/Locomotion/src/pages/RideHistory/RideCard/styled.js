import React from 'react';
import styled from 'styled-components';
import i18n from '../../../I18n';
import blackRightArrow from '../../../assets/arrowright.png';
import activity from '../../../assets/activitiy.png';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../context/theme';

export const RideDrillDownIcon = styled.Image.attrs({
  source: blackRightArrow,
  resizeMode: 'cover',
})`
  width: 10px;
  height: 20px;
  opacity: .2;
  align-self: center;
`;

export const NoRidesImage = styled.Image.attrs({
  source: activity,
  resizeMode: 'cover',
})`
  width: 176px;
  height: 120.3px;
  align-self: center;
`;

export const RideViewSpacer = styled.View`
  border-bottom-color: #e0e0e0;
  border-bottom-width: 1px;
`;

export const TouchableRideViewContainer = styled.TouchableOpacity`
  flex-direction: row;
  padding: 20px;
  justify-content: space-between;
`;

export const BaseRideViewContainer = styled.View`
  justify-content: space-between;
`;

export const MainRideViewSectionContainer = styled(BaseRideViewContainer)`
  padding: 20px;
  flex-direction: row;
`;

export const RideViewSectionContainer = styled(BaseRideViewContainer)`
  padding: 5px 20px;
`;


export const RideViewContainer = styled.ScrollView.attrs(({
  contentContainerStyle: {
    paddingBottom: 60,
  },
}))`

`;

export const MapRideViewContainer = styled(BaseRideViewContainer)`
  padding: 15px;
  height: 200px;
`;


export const DriverAvatarContainer = styled.View`
`;

export const DriverDetailContainer = styled.View`
  padding-left: 10px;
  flex-direction: row;
`;

export const DriverDetailText = styled.Text`
`;

export const DriverAvatar = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 100px;
  border-width: 1px;
  border-color: #a7a7a7;
 `;

export const RideDrillDownContainer = styled.View`
  flex: 1;
  justify-content: center;
  padding-left: 15px;
`;

export const BlankContainer = styled.View`
  padding-right: 15px;
`;

export const RideViewTextContainer = styled.View`
  flex: 6;
`;

export const RideViewSecTextContainer = styled.View`
  flex: 3;
`;

export const CenterContainer = styled.View`
  margin-top: ${({ addTop }) => (addTop ? '50%' : '0')};
  align-self: center;
`;

export const BaseText = styled.Text`
  padding-top: 5px;
`;

export const NoRidesListContainer = styled(BaseText)`
  padding: 45px 0;
  text-align: center;
  font-size: 16px;
`;

export const NoRidesInList = () => (
  <CenterContainer addTop>
    <NoRidesImage />
    <NoRidesListContainer>
      {i18n.t('activityPage.noActivity')}
    </NoRidesListContainer>
  </CenterContainer>
);

export const MarkerTitleContainer = styled.View`
  background-color: white;
  border-radius: 20px;
  padding: 5px 10px;
  margin-bottom: 3px;
`;

export const MarkerTitleText = styled.Text`
  ${FONT_SIZES.MEDIUM}
  ${FONT_WEIGHTS.LIGHT}
`;

export const MarkerTitle = React.memo(({ children }) => (
  <>
    <MarkerTitleContainer>
      <MarkerTitleText>
        {children}
      </MarkerTitleText>
    </MarkerTitleContainer>
  </>
));

export const DayTitleText = styled(BaseText)`
  text-transform: capitalize;
  ${FONT_SIZES.H3}
  ${FONT_WEIGHTS.SEMI_BOLD}
`;

export const RideViewSectionTitleText = styled(BaseText)`
  text-transform: capitalize;
  ${FONT_SIZES.LARGE}
  ${FONT_WEIGHTS.MEDIUM}
`;

export const DayTitleSubText = styled(BaseText)`
  ${({ noCap }) => (noCap ? '' : 'text-transform: capitalize;')}
`;

export const DaySecTitleText = styled(BaseText)`
  text-align: right;
  ${FONT_SIZES.H3}
  ${FONT_WEIGHTS.MEDIUM}
`;

export const DaySecTitleSubText = styled(BaseText)`
  text-align: right;
`;

export const DayTitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
  background-color: white;
`;

export const RideViewTitleContainer = styled.View`
`;

export const DriverCardContainer = styled.View`
padding-left: 20px;
`;

export const StopPointsVerticalViewContainer = styled.View`
padding: 0 20px;
`;
