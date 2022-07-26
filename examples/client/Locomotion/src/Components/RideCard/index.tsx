import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { PaymentIcon } from 'react-native-payment-icons';
import { RIDE_STATES } from '../../lib/commonTypes';
import { RideInterface, RidePageContext } from '../../context/newRideContext';
import cashPaymentMethod from '../../pages/Payments/cashPaymentMethod';
import i18n from '../../I18n';
import RoundedButton from '../RoundedButton';
import TextRowWithIcon from '../TextRowWithIcon';
import {
  CardContainer, RideDate, ServiceType, DateContainer,
} from './styled';
import StopPointsVerticalView from '../StopPointsVerticalView';
import { getFormattedPrice } from '../../context/newRideContext/utils';
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

type Price = {
  amount: number,
  currency: string
}

const RideCard = ({
  ride, onPress, serviceName, paymentMethod, scheduledTo,
}: RideCardProps) => {
  const [totalPriceWithCurrency, setTotalPriceWithCurrency] = useState<Price>();
  const {
    getRideTotalPriceWithCurrency,
  } = useContext(RidePageContext);

  const updateTotalPrice = async () => {
    const price = await getRideTotalPriceWithCurrency(ride.id);
    setTotalPriceWithCurrency(price);
  };

  useEffect(() => {
    updateTotalPrice();
  }, [ride]);

  return (
    <CardContainer>
      <DateContainer>
        <RideDate>
          {moment(scheduledTo).format('MMMM DD, YYYY, h:mm A')}
        </RideDate>
        <RideDate>
          {ride.state === RIDE_STATES.CANCELED && totalPriceWithCurrency?.amount === 0
            ? getFormattedPrice(totalPriceWithCurrency?.currency, 0)
            : getFormattedPrice(totalPriceWithCurrency?.currency || '',
              totalPriceWithCurrency?.amount || 0)}
        </RideDate>
      </DateContainer>
      <ServiceType>
        {serviceName}
      </ServiceType>
      <StopPointsVerticalView ride={ride} />
      {paymentMethod && <CardComponent paymentMethod={paymentMethod} />}
      <RoundedButton onPress={onPress} hollow type="cancel">
        {i18n.t('home.cancelRideButton')}
      </RoundedButton>
    </CardContainer>
  );
};

export default RideCard;
