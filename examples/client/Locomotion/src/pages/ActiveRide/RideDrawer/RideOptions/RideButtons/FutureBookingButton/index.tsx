import React, { useContext } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import SvgIcon from '../../../../../../Components/SvgIcon';
import clock from '../../../../../../assets/bottomSheet/clock.svg';
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
  return (
    <>
      <SvgIcon fill="#333" Svg={clock} height={15} width={15} />
      <TimeText>{ride?.afterTime ? moment(ride.afterTime).format('DD.MM.YY, HH:mm') : nowText}</TimeText>
    </>
  );
};

export default FutureBookingButton;
