import React, { useContext, useEffect, useState } from 'react';
import propsTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CHARGE_FOR_TIP, RIDE_STATES } from '../../lib/commonTypes';
import { MAIN_ROUTES } from '../../pages/routes';
import { getFormattedPrice } from '../../context/newRideContext/utils';
import CardRow from '../CardRow';
import CardsTitle from '../CardsTitle';
import i18n from '../../I18n';
import { PriceCalculation, RidePageContext } from '../../context/newRideContext';
import {
  PaymentRow, RidePriceDetails, PriceText, ViewDetails, CardRowContainer,
} from './styled';
import { PaymentMethodInterface } from '../../context/payments/interface';
import PaymentContext from '../../context/payments';
import * as navigationService from '../../services/navigation';

const RidePaymentDetails = ({
  rideId,
  paymentMethodId,
  rideHistory = false,
  state,
} :{
  rideId: string,
  paymentMethodId: string,
  rideHistory: boolean
  currency: string,
  state: string

}) => {
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodInterface>();
  const {
    getRidePriceCalculation,
  } = useContext(RidePageContext);

  const usePayments = PaymentContext.useContainer();
  const updatePriceCalculation = async () => {
    const calculation = await getRidePriceCalculation(rideId);
    setPriceCalculation(calculation);
  };

  const updatePaymentMethod = async () => {
    const currentPaymentMethod = usePayments.paymentMethods.find(({ id }) => id === paymentMethodId);
    setPaymentMethod(currentPaymentMethod);
  };

  const totalAmount = (priceCalculation?.totalPrice || 0)
  + (priceCalculation?.additionalCharges.find(({ chargeFor }) => chargeFor === CHARGE_FOR_TIP)?.amount || 0);

  useEffect(() => {
    updatePriceCalculation();
  }, []);

  useEffect(() => {
    updatePaymentMethod();
  }, []);

  return (paymentMethod ? (
    <>
      <CardsTitle noPaddingLeft title={i18n.t('ride.paymentMethod')} />
      <PaymentRow>
        <CardRowContainer>
          <CardRow {...paymentMethod} />
        </CardRowContainer>
        <RidePriceDetails>

          {!rideHistory ? (totalAmount === 0
            ? <PriceText>{`${i18n.t('rideDetails.noCharge')}`}</PriceText>
            : (
              <PriceText>
                {getFormattedPrice(priceCalculation?.currency,
                  totalAmount)}
              </PriceText>
            )
          ) : null}

          <TouchableOpacity onPress={() => navigationService.navigate(MAIN_ROUTES.RIDE_PRICE_BREAKDOWN,
            { rideId, rideHistory })}
          >
            {state !== RIDE_STATES.CANCELED
            || (state === RIDE_STATES.CANCELED
             && priceCalculation?.items.find(x => x.cancellationRule)) ? (
               <ViewDetails>
                 {i18n.t('ride.viewDetails').toString()}
               </ViewDetails>
              ) : undefined}
          </TouchableOpacity>
        </RidePriceDetails>
      </PaymentRow>
    </>
  ) : null
  );
};

RidePaymentDetails.propTypes = {
  rideHistory: propsTypes.bool,
  state: propsTypes.string,
};

RidePaymentDetails.defaultProps = {
  rideHistory: false,
  state: 'pending',
};

export default RidePaymentDetails;
