import React from 'react';
import { TouchableOpacity } from 'react-native';
import { getFormattedPrice } from '../../context/newRideContext/utils';
import CardRow from '../CardRow';
import CardsTitle from '../CardsTitle';
import i18n from '../../I18n';
import {
  PaymentRow, RidePriceDetails, PriceText, ViewDetails, CardRowContainer,
} from './styled';

const RidePaymentDetails = ({
  payment,
  priceAmount,
  priceCurrency,
}: {
    payment: any,
    priceAmount: number,
    priceCurrency: string,
}) => (payment ? (
  <>
    <CardsTitle title={i18n.t('ride.paymentMethod')} />
    <PaymentRow>
      <CardRowContainer>
        <CardRow {...payment.paymentMethod} name={i18n.t('payments.cash')} />
      </CardRowContainer>
      <RidePriceDetails>
        <PriceText>{getFormattedPrice(priceCurrency, priceAmount)}</PriceText>
        <TouchableOpacity>
          <ViewDetails>
            {i18n.t('ride.viewDetails').toString()}
          </ViewDetails>
        </TouchableOpacity>
      </RidePriceDetails>
    </PaymentRow>
  </>
) : null
);


export default RidePaymentDetails;
