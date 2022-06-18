import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import EtaText from './EtaText';
import i18n from '../../../../I18n';

const address = `
min-height: 50;
padding-top: 10;
padding-bottom: 10px;
padding-start: 24;
align-items: center;
flex-direction: row;
`;

export const StopPointDot = styled.View`
  width: 10px;
  height: 10px;
  background-color: ${({origin, theme}) =>
    origin ? theme.primaryColor : theme.secondaryColor};
  border-radius: 10px;
`;

export const PickupRow = styled.View`
  border-bottom-color: #f2f2f2;
  border-bottom-width: 1px;
  ${address}
`;

const StopPointDotContainer = styled.View`
  position: absolute;
  left: 35;
  ${({origin}) => (origin ? 'bottom: 10;' : 'top: -10;')}
  justify-content: center;
  align-items: center;
  ${({origin}) => (origin ? '' : 'flex-direction: column-reverse;')}
  width: 20;
  height: 100%;
`;

const StopPointDotTimeLine = styled.View`
  width: 2px;
  flex: 1;
  background-color: ${({origin, theme}) =>
    origin ? theme.primaryColor : theme.secondaryColor};
`;

const AddressTextCont = styled.View`
  flex: 1;
`;

const AddressText = styled.Text`
  font-size: 14px;
  color: ${({pickup, theme}) =>
    pickup ? theme.primaryColor : theme.secondaryColor};
  margin-start: 22;
  margin-end: 16;
`;

const RowContainer = styled.View`
  min-height: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: center;
  flex-direction: row;
  ${({paddingStart}) =>
    paddingStart
      ? `
  padding-start: 40;
  `
      : null}
  ${({useBorder}) =>
    useBorder
      ? `
    border-bottom-color: #e2e2e2;
    border-bottom-width: 1;
  `
      : null}
`;

const OfferRideEtaContainer = styled.TouchableOpacity`
  position: absolute;
  left: 10px;
  bottom: 0px;
  z-index: 999;
`;
const OfferRideEtaText = styled.Text`
  font-size: 9px;
  color: #b5b5b5;
  text-align: center;
  margin-bottom: 5px;
`;

export default ({
  pickup,
  description,
  eta,
  useBorder,
  rideOffer,
  etaDrift,
  etaMediumThreshold,
  etaHighThreshold,
}) => {
  const rideEta = moment(rideOffer.dropoffTime).diff(
    moment(rideOffer.pickupTime),
    'minutes',
  );

  return (
    <RowContainer pickup={pickup} useBorder={useBorder} paddingStart>
      <StopPointDotContainer origin={pickup}>
        <StopPointDot origin={pickup} />
        <StopPointDotTimeLine origin={pickup} />
      </StopPointDotContainer>
      {pickup && rideOffer.pickupTime && rideOffer.dropoffTime ? (
        <OfferRideEtaContainer>
          <OfferRideEtaText>{`${rideEta} min`}</OfferRideEtaText>
        </OfferRideEtaContainer>
      ) : null}
      <AddressTextCont>
        <AddressText numberOfLines={2} pickup={pickup}>
          {`${i18n.t(
            `home.offerCard.${pickup ? 'pickup' : 'dropoff'}`,
          )}: ${description}`}
        </AddressText>
        <EtaText
          etaDrift={etaDrift}
          pickup={pickup}
          etaMediumThreshold={etaMediumThreshold}
          etaHighThreshold={etaHighThreshold}
          eta={eta}
        />
      </AddressTextCont>
    </RowContainer>
  );
};
