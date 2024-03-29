import React, { useContext, useEffect, useState } from 'react';
import propsTypes from 'prop-types';
import { CHARGE_FOR_TIP, RIDE_STATES } from '../../lib/commonTypes';
import { MAIN_ROUTES } from '../../pages/routes';
import { getFormattedPrice } from '../../context/newRideContext/utils';
import CardRow from '../CardRow';
import CardsTitle from '../CardsTitle';
import i18n from '../../I18n';
import { PriceCalculation, RideInterface, RidePageContext } from '../../context/newRideContext';
import {
  PaymentRow, RidePriceDetails, PriceText, ViewDetails, CardRowContainer,
} from './styled';
import { PaymentMethodInterface } from '../../context/payments/interface';
import PaymentContext from '../../context/payments';
import SettingContext from '../../context/settings';
import * as navigationService from '../../services/navigation';
import Button from '../Button';
import showPriceBasedOnAccount from '../../services/showPriceBasedOnAccount';

const RidePaymentDetails = ({
  ride,
  paymentMethod,
  rideHistory = false,
  state,
} :{
  ride: RideInterface,
  paymentMethod: PaymentMethodInterface,
  rideHistory: boolean
  currency: string,
  state: string

}) => {
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation>();
  const {
    getRidePriceCalculation,
  } = useContext(RidePageContext);

  const { getBusinessAccountById } = PaymentContext.useContainer();
  const { showPrice, loadShowPrice } = SettingContext.useContainer();

  const updatePriceCalculation = async () => {
    const calculation = await getRidePriceCalculation(ride?.id);
    setPriceCalculation(calculation);
  };

  const totalAmount = (priceCalculation?.totalPrice || 0)
  + (priceCalculation?.additionalCharges.find(({ chargeFor }) => chargeFor === CHARGE_FOR_TIP)?.amount || 0);

  useEffect(() => {
    updatePriceCalculation();
    showPriceBasedOnAccount(loadShowPrice, getBusinessAccountById, ride.businessAccountId);
  }, []);


  return (paymentMethod ? (
    <>
      <CardsTitle noPaddingLeft title={i18n.t('ride.paymentMethod')} />
      <PaymentRow>
        <CardRowContainer>
          <CardRow {...{ ...paymentMethod, businessAccountId: ride.businessAccountId }} />
        </CardRowContainer>
        <RidePriceDetails>

          {!rideHistory && (totalAmount === 0
            ? <PriceText>{`${i18n.t('rideDetails.noCharge')}`}</PriceText>
            : (showPrice
              && (
              <PriceText testID="priceText">
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
              { rideId: ride.id, rideHistory })}
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
