import React, { useContext } from 'react';
import { Text } from 'react-native';
import moment from 'moment';
import styled, { ThemeContext } from 'styled-components';
import SvgIcon from '../../../../../../Components/SvgIcon';
import clock from '../../../../../../assets/bottomSheet/clock.svg';
import chevron from '../../../../../../assets/chevron.svg';
import i18n from '../../../../../../I18n';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';
import { RidePageContext } from '../../../../../../context/newRideContext';

const TimeText = styled(Text)`
    ${FONT_SIZES.LARGE}
    ${FONT_WEIGHTS.REGULAR}
    margin: 5px;
`;

const FutureBookingButton = () => {
  const { ride } = useContext(RidePageContext);
  const nowText = i18n.t('bottomSheetContent.ride.now');
  const { primaryColor } = useContext(ThemeContext);
  const isFutureRide = ride?.scheduledTo;
  const chosenTime = isFutureRide && moment(ride.scheduledTo).format('DD.MM.YY, HH:mm');
  return (
    <>
      <SvgIcon fill={primaryColor} Svg={clock} height={15} width={15} />
      <TimeText>{isFutureRide ? chosenTime : nowText}</TimeText>
      <SvgIcon stroke="#333333" Svg={chevron} height={10} width={10} style={{ transform: [{ rotate: '90deg' }] }} />
    </>
  );
};

export default FutureBookingButton;
