import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import moment from 'moment';

import i18n from '../../../../I18n';

const AddressTextCont = styled.View``;

const AddressText = styled.Text`
  font-size: 11px;
  color: #666666;
  margin-top: 5px;
  min-height: 30px;
`;

const EtaText = styled.Text`
  font-size: 16px;
  color: #000000;
  font-weight: 600;
  margin-top: 10px;
`;

const RowContainer = styled.TouchableOpacity`
  min-height: 50;
  padding-bottom: 10px;
  align-items: center;
  flex-direction: column;
  ${({paddingStart}) =>
    paddingStart
      ? `
  padding-start: 5;
  `
      : null}
  flex: 1;
`;

const StopPointTitle = styled.Text`
  font-size: 14px;
  color: ${({pickup, theme}) =>
    pickup ? theme.primaryColor : theme.secondaryColor};
  line-height: 16px;
`;

export default ({
  pickup,
  description,
  eta,
  firstEta,
  completedAt,
  etaDrift,
  paddingStart,
  showEta,
}) => {
  const etaToDisplay = () => {
    if (!firstEta) {
      return '';
    }
    if (showEta) {
      return moment(eta).format('HH:mm');
    }
    return `${moment(firstEta).format('HH:mm')} - ${moment(firstEta)
      .add(etaDrift, 'minutes')
      .format('HH:mm')}`;
  };

  return (
    <RowContainer pickup={pickup} paddingStart={paddingStart}>
      <AddressTextCont>
        <View>
          <StopPointTitle pickup={pickup}>
            {i18n.t(
              pickup
                ? 'home.bookingCard.pickupEtaTitle'
                : 'home.bookingCard.dropoffEtaTitle',
            )}
          </StopPointTitle>
        </View>
        <View>
          <AddressText numberOfLines={2}>
            {description ||
              i18n.t(pickup ? 'home.choosePickup' : 'home.chooseDropoff')}
          </AddressText>
        </View>
        <View>
          {eta || completedAt ? <EtaText>{etaToDisplay()}</EtaText> : null}
        </View>
      </AddressTextCont>
    </RowContainer>
  );
};
