import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import SvgIcon from '../../../../../../Components/SvgIcon';
import clock from '../../../../../../assets/bottomSheet/clock.svg'
import i18n from '../../../../../../I18n';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';

const TimeText = styled(Text)`
    ${FONT_SIZES.LARGE}
    ${FONT_WEIGHTS.REGULAR}
    color: ${({ theme }) => theme.disabledColor};
    margin: 5px;
`;

const FutureBookingButton = () => {
 const nowText = i18n.t('bottomSheetContent.ride.now');
    return (
        <>
            <SvgIcon Svg={clock} height={15} width={15} />
            <TimeText>{nowText}</TimeText>
        </>
    )
};

export default FutureBookingButton;