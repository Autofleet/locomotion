import React, { useContext } from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { RidePageContext } from '../../../../../context/newRideContext';
import ServiceCard from './ServiceCard';
import { ServiceOptionsContainer } from './styles';

const ServiceOptions = () => {
  const { serviceEstimations } = useContext(RidePageContext);

  return (
    <ServiceOptionsContainer alwaysBounceVertical={false}>
      {/* <>
        {serviceEstimations.map(option => <ServiceCard service={option} />)}
      </> */}
      <SkeletonContent
        containerStyle={{}}
        isLoading
        layout={[
          { width: 180, height: 20, marginBottom: 6 },
          { width: 220, height: 20 },
        ]}
          />
    </ServiceOptionsContainer>
  );
};

export default ServiceOptions;
