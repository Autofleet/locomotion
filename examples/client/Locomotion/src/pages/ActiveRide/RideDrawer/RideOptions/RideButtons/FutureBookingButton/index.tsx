import React, { useContext } from 'react';
import { Text } from 'react-native';
import styled, { ThemeContext } from 'styled-components';
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
  const { primaryColor } = useContext(ThemeContext);

  return (
    <>
      <SvgIcon fill={primaryColor} Svg={clock} height={15} width={15} />
      <TimeText>{nowText}</TimeText>
    </>
  );
};

export default FutureBookingButton;
