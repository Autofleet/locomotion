import { Image, Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

const BaseRideViewContainer = styled(View)`
  justify-content: space-between;
`;

const BaseText = styled(Text)`
  padding-top: 5px;
`;

export const RatingBarContainer = styled(View)`
  padding-top: 5px;
  margin-left: auto;
`;

export const DriverDetailsContainer = styled(View)`
flex-grow: 1;
`;

export const DriverAvatarContainer = styled(View)`
`;

export const DriverDetailContainer = styled(View)`
  padding-left: 10px;
  flex-direction: row;
`;

export const DriverRatingText = styled(Text)`
    color: ${({ theme }) => theme.disabledColor};
`;


export const DriverDetailText = styled<any>(Text)`
    ${({ activeRide }) => (activeRide ? FONT_SIZES.H2 : FONT_SIZES.LARGE)};
    ${FONT_WEIGHTS.MEDIUM}
`;

export const DriverAvatar = styled(Image)`
  width: 60px;
  height: 60px;
  border-radius: 100px;
  border-color: ${({ theme }) => theme.primaryColor};
  border-width: 4;
  border-radius: 100;
 `;


export const DriverSectionContainer = styled(BaseRideViewContainer)`
`;


export const DriverRatingContainer = styled(View)`
  flex-direction: row;
  padding-top: 5px;
  align-items: center;
`;

export const RideViewTitleContainer = styled(View)`
`;

export const RideViewSectionTitleText = styled(BaseText)`
  text-transform: capitalize;
  ${FONT_SIZES.LARGE}
  ${FONT_WEIGHTS.MEDIUM}
`;

export const VehicleModelNameText = styled(Text)`
    ${FONT_SIZES.MEDIUM};
    ${FONT_WEIGHTS.REGULAR};
    color: ${({ theme }) => theme.disabledColor};
`;
