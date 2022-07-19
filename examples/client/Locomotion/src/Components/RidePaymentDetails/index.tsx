import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MAIN_ROUTES } from '../../pages/routes';
import { getFormattedPrice } from '../../context/newRideContext/utils';
import CardRow from '../CardRow';
import CardsTitle from '../CardsTitle';
import i18n from '../../I18n';
import {
  PaymentRow, RidePriceDetails, PriceText, ViewDetails, CardRowContainer,
} from './styled';

type Nav = {
  navigate: (value: string, object?: any) => void;
}

const RidePaymentDetails = ({
  payment,
  priceAmount,
  priceCurrency,
}: {
    payment: any,
    priceAmount: number,
    priceCurrency: string,
}) => {
  const navigation = useNavigation<Nav>();
  return (payment ? (
    <>
      <CardsTitle title={i18n.t('ride.paymentMethod')} />
      <PaymentRow>
        <CardRowContainer>
          <CardRow name={i18n.t('payments.cash')} {...payment.paymentMethod} />
        </CardRowContainer>
        <RidePriceDetails>
          <PriceText>{getFormattedPrice(priceCurrency, priceAmount)}</PriceText>
          <TouchableOpacity onPress={() => navigation.navigate(MAIN_ROUTES.RIDE_PRICE_BREAKDOWN)}>
            <ViewDetails>
              {i18n.t('ride.viewDetails').toString()}
            </ViewDetails>
          </TouchableOpacity>
        </RidePriceDetails>
      </PaymentRow>
    </>
  ) : null
  );
};


export default RidePaymentDetails;
