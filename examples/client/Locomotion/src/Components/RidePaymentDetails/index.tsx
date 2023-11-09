import React, { useContext, useEffect, useState } from 'react';
import propsTypes from 'prop-types';
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
import Button from '../Button';

const RidePaymentDetails = ({
  rideId,
  paymentMethod,
  rideHistory = false,
  state,
} :{
  rideId: string,
  paymentMethod: PaymentMethodInterface,
  rideHistory: boolean
  currency: string,
  state: string

}) => {
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation>();
  const {
    getRidePriceCalculation,
  } = useContext(RidePageContext);

  const { showPrice, loadShowPrice } = PaymentContext.useContainer();

  const updatePriceCalculation = async () => {
    const calculation = await getRidePriceCalculation(rideId);
    setPriceCalculation(calculation);
  };

  const totalAmount = (priceCalculation?.totalPrice || 0)
  + (priceCalculation?.additionalCharges.find(({ chargeFor }) => chargeFor === CHARGE_FOR_TIP)?.amount || 0);

  useEffect(() => {
    updatePriceCalculation();
    loadShowPrice();
  }, []);

  return (paymentMethod ? (
    <>
      <CardsTitle noPaddingLeft title={i18n.t('ride.paymentMethod')} />
      <PaymentRow>
        <CardRowContainer>
          <CardRow {...paymentMethod} />
        </CardRowContainer>
        <RidePriceDetails>

          {!rideHistory && (totalAmount === 0
            ? <PriceText>{`${i18n.t('rideDetails.noCharge')}`}</PriceText>
            : (showPrice
              && (
              <PriceText>
                {getFormattedPrice(priceCalculation?.currency,
                  totalAmount)}
              </PriceText>
              )
            )
          )}

          {showPrice && (
          <Button
            testID="viewRidePaymentDetails"
            noBackground
            onPress={() => navigationService.navigate(MAIN_ROUTES.RIDE_PRICE_BREAKDOWN,
              { rideId, rideHistory })}
          >
            {state !== RIDE_STATES.CANCELED
            || (state === RIDE_STATES.CANCELED
             && priceCalculation?.items.find(x => x.cancellationRule)) ? (
               <ViewDetails>
                 {i18n.t('ride.viewDetails').toString()}
               </ViewDetails>
              ) : undefined}
          </Button>
          )}
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
