import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import SvgIcon from '../../../../../../Components/SvgIcon';
import clock from '../../../../../../assets/bottomSheet/clock.svg';
import i18n from '../../../../../../I18n';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';

const TimeText = styled(Text)`
    ${FONT_SIZES.LARGE}
    ${FONT_WEIGHTS.MEDIUM}
    color: ${({ theme }) => theme.disabledColor};
    margin: 5px;
`;

const FutureBookingButton = () => {
  const nowText = i18n.t('bottomSheetContent.ride.now');
  return (
    <>
      <SvgIcon fill="#333" Svg={clock} height={15} width={15} />
      <TimeText>{nowText}</TimeText>
    </>
  );
};

export default FutureBookingButton;
