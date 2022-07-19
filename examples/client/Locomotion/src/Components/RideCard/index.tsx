import React from 'react';
import moment from 'moment';
import { PaymentIcon } from 'react-native-payment-icons';
import { RideInterface } from '../../context/newRideContext';
import i18n from '../../I18n';
import RoundedButton from '../RoundedButton';
import TextRowWithIcon from '../TextRowWithIcon';
import {
  CardContainer, RideDate, ServiceType, DateContainer,
} from './styled';
import StopPointsVerticalView from '../StopPointsVerticalView';
import { getFormattedPrice } from '../../context/newRideContext/utils';

interface CardComponentProps {
    name: string;
    brand: any;
}
const CardComponent = ({ name, brand }: CardComponentProps) => (
  <TextRowWithIcon
    text={name}
    Image={() => <PaymentIcon type={brand} />}
    style={{ marginTop: 10, marginBottom: 10 }}
  />
);

interface RideCardProps {
    ride: RideInterface;
    onPress: (ride: RideInterface) => void;
    serviceName: string;
    paymentMethod: any;
    scheduledTo: string;
}

const RideCard = ({
  ride, onPress, serviceName, paymentMethod, scheduledTo,
}: RideCardProps) => (
  <CardContainer>
    <DateContainer>
      <RideDate>
        {moment(scheduledTo).format('MMMM DD, YYYY, h:mm A')}
      </RideDate>
      <RideDate>
        {getFormattedPrice(ride.priceCurrency, ride.priceAmount)}
      </RideDate>
    </DateContainer>
    <ServiceType>
      {serviceName}
    </ServiceType>
    <StopPointsVerticalView ride={ride} />
    <CardComponent name={paymentMethod.name} brand={paymentMethod.brand} />
    <RoundedButton onPress={onPress} hollow type="cancel">
      {i18n.t('home.cancelRideButton')}
    </RoundedButton>
  </CardContainer>
);

export default RideCard;
