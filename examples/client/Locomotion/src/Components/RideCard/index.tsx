import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import i18n from '../../I18n';
import RoundedButton from '../RoundedButton';
import TextRowWithIcon from '../TextRowWithIcon';
import { CardContainer, RideDate, ServiceType } from './styled';
import StopPointsVerticalView from '../StopPointsVerticalView';
import { RidePageContext } from '../../context/newRideContext';

const CardComponent = () => (
  <TextRowWithIcon text="hi" icon={null} style={{ marginTop: 10, marginBottom: 10 }} />
);
const RideCard = ({ ride }) => {
  const [serviceName, setServiceName] = useState(null);
  const {
    getService,
  } = useContext(RidePageContext);

  const getServiceName = async () => {
    const service = await getService(ride.serviceId);
    setServiceName(service.displayName);
  };
  useEffect(() => {
    getServiceName();
  }, []);
  return (
    <CardContainer>
      <RideDate>
        {moment(ride.scheduledTo).format('MMMM DD, YYYY, H:mm A')}
      </RideDate>
      <ServiceType>
        {serviceName}
      </ServiceType>
      <StopPointsVerticalView ride={ride} />
      <CardComponent />
      <RoundedButton onPress={() => null} hollow type="cancel">
        {i18n.t('home.cancelRideButton')}
      </RoundedButton>
    </CardContainer>
  );
};

export default RideCard;
