import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { PaymentIcon } from 'react-native-payment-icons';
import { View } from 'react-native';
import { RIDE_STATES } from '../../lib/commonTypes';
import { PriceCalculation, RideInterface, RidePageContext } from '../../context/newRideContext';
import cashPaymentMethod from '../../pages/Payments/cashPaymentMethod';
import i18n from '../../I18n';
import RoundedButton from '../RoundedButton';
import TextRowWithIcon from '../TextRowWithIcon';
import {
  CardContainer, RideDate, ServiceType, DateContainer, EstimatedText,
  TopTextsContainer, TopPriceContainer,
} from './styled';
import StopPointsVerticalView from '../StopPointsVerticalView';
import { getFormattedPrice, isPriceEstimated } from '../../context/newRideContext/utils';
import cashIcon from '../../assets/cash.svg';


interface CardComponentProps {
  paymentMethod: {
    name: string;
    brand: any;
    id: string;
  }
}
const CardComponent = ({ paymentMethod }: CardComponentProps) => {
  const isCash = cashPaymentMethod.id === paymentMethod.id;
  return (
    <TextRowWithIcon
      text={isCash ? cashPaymentMethod.id : paymentMethod.name}
      Image={() => !isCash && <PaymentIcon type={paymentMethod.brand} />}
      icon={isCash && cashIcon}
      style={{ marginTop: 10, marginBottom: 10 }}
      iconWidth={40}
      iconHeight={20}
    />
  );
};

interface RideCardProps {
    ride: RideInterface;
    onPress: (ride: RideInterface) => void;
    serviceName: string;
    paymentMethod: any;
    scheduledTo: string;
}

const RideCard = ({
  ride, onPress, serviceName, paymentMethod, scheduledTo,
}: RideCardProps) => {
  const [ridePriceCalculation, setRidePriceCalculation] = useState<PriceCalculation>();
  const {
    getRidePriceCalculation,
  } = useContext(RidePageContext);

  const addPriceCalculation = async () => {
    const price = await getRidePriceCalculation(ride.id, ride.priceCalculationId);
    setRidePriceCalculation(price);
  };

  useEffect(() => {
    if (!ridePriceCalculation) {
      addPriceCalculation();
    }
  }, [ride]);

  return (
    <CardContainer>
      <DateContainer>
        <TopTextsContainer>
          <RideDate>
            {moment(scheduledTo).format('MMMM DD, YYYY, h:mm A')}
          </RideDate>
          <ServiceType>
            {serviceName}
          </ServiceType>
        </TopTextsContainer>
        <TopPriceContainer>
          <RideDate>
            {getFormattedPrice(ride.priceCurrency, ride.priceAmount)}
          </RideDate>
          {ridePriceCalculation && isPriceEstimated(ridePriceCalculation.calculationBasis)
            ? (
              <EstimatedText>
                {i18n.t('rideDetails.estimatedFare').toString()}
              </EstimatedText>
            )
            : null}
        </TopPriceContainer>
      </DateContainer>

      <StopPointsVerticalView ride={ride} />
      {paymentMethod && <CardComponent paymentMethod={paymentMethod} />}
      <RoundedButton testID="cancelRide" onPress={onPress} hollow type="cancel">
        {i18n.t('home.cancelRideButton')}
      </RoundedButton>
    </CardContainer>
  );
};

export default RideCard;
