import React, {Fragment} from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import I18n from '../../../../../I18n';
import RoundedButton from '../../../../../Components/RoundedButton';
import SliderButton from '../../../../../Components/SlideButton';

const address = `
min-height: 50;
padding-top: 10;
padding-bottom: 10px;
padding-start: 24;
align-items: center;
flex-direction: row;
`;

export const StopPointsEtaContainer = styled.View`
  ${address}
  padding-top: 0px;
  flex-direction: row;
  padding-start: 0;
  padding-end: 0;
  justify-content: space-between;
`;

export const DrawerButtonContainer = styled.View`
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 0 auto;
  min-height: 40px;
  width: 50%;
`;

export const OfferExpiredText = styled.Text`
  font-size: 12;
  color: #b5b5b5;
  text-align: center;
  margin-bottom: 5px;
`;

export default ({
  offerExpired,
  onVerified,
  setLoading,
  onRenewOffer,
  futureRide,
}) => (
  <Fragment>
    {!offerExpired || futureRide ? (
      <SliderButton onVerified={onVerified} setLoading={setLoading} />
    ) : (
      <DrawerButtonContainer>
        <OfferExpiredText>
          {`${offerExpired ? I18n.t('home.offerCard.expiredOfferText') : ''}`}
        </OfferExpiredText>
        <RoundedButton
          onPress={onRenewOffer}
          setLoading={setLoading}
          hollow={offerExpired}
          data-test-id="RenewOfferButton">
          {`${I18n.t(
            !offerExpired
              ? 'home.offerCard.confirmOffer'
              : 'home.offerCard.expiredOffer',
          )}`}
        </RoundedButton>
      </DrawerButtonContainer>
    )}
  </Fragment>
);
