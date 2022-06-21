import React, { useContext } from 'react';
import { RidePageContext } from '../../../../../context/newRideContext';
import ServiceCard from './ServiceCard';
import { ServiceOptionsContainer } from './styles';

const ServiceOptions = () => {
  const { serviceEstimations } = useContext(RidePageContext);

  return (
    <ServiceOptionsContainer alwaysBounceVertical={false}>
      <>
        {serviceEstimations.map(option => <ServiceCard service={option} selected={false} />)}
      </>
    </ServiceOptionsContainer>
  );
};

export default ServiceOptions;
