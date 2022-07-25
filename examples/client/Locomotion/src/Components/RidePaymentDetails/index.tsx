import React, { useContext, useEffect, useState } from 'react';
import propsTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RIDE_STATES } from '../../lib/commonTypes';
import { MAIN_ROUTES } from '../../pages/routes';
import { getFormattedPrice } from '../../context/newRideContext/utils';
import CardRow from '../CardRow';
import CardsTitle from '../CardsTitle';
import i18n from '../../I18n';
import { RidePageContext } from '../../context/newRideContext';
import {
  PaymentRow, RidePriceDetails, PriceText, ViewDetails, CardRowContainer,
} from './styled';
import { PaymentMethodInterface } from '../../context/payments/interface';

type Nav = {
  navigate: (value: string, object?: any) => void;

}

const RidePaymentDetails = ({
  rideId,
  paymentMethod,
  rideHistory = false,
  state,
  currency,
} :{
  rideId: string,
  paymentMethod: PaymentMethodInterface,
  rideHistory: boolean
  currency: string,
  state: string

}) => {
  const navigation = useNavigation<Nav>();
  const [totalAmount, setTotalAmount] = useState(0);
  const [haveCancelationFee, setHaveCancelationFee] = useState(false);
  const {
    getRidePriceCalculation,
  } = useContext(RidePageContext);
  const updatePriceCalculation = async () => {
    if (state === 'canceled') {
      return { amount: 0, currency };
    }
    const calculation = await getRidePriceCalculation(rideId);
    setTotalAmount((calculation?.totalPrice || 0)
     + (calculation?.discount || 0)
     + (calculation?.additionalCharges.find(({ chargeFor }) => chargeFor === 'tip')?.amount || 0));
    setHaveCancelationFee(calculation?.haveCancelationFee || false);
  };

  useEffect(() => {
    updatePriceCalculation();
  }, [rideId]);

  return (paymentMethod ? (
    <>
      <CardsTitle title={i18n.t('ride.paymentMethod')} />
      <PaymentRow>
        <CardRowContainer>
          <CardRow {...paymentMethod} />
        </CardRowContainer>
        <RidePriceDetails>
          <PriceText>{getFormattedPrice(currency, totalAmount)}</PriceText>
          <TouchableOpacity onPress={() => navigation.navigate(MAIN_ROUTES.RIDE_PRICE_BREAKDOWN,
            { rideId, rideHistory })}
          >
            {/* {state !== RIDE_STATES.CANCELED
            || (state === RIDE_STATES.CANCELED
             && haveCancelationFee) ? ( */}
            <ViewDetails>
              {i18n.t('ride.viewDetails').toString()}
            </ViewDetails>
            {/* ) : undefined} */}
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
