import React, { useContext, useState } from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { RidePageContext } from '../../../../../context/newRideContext';
import ServiceCard from './ServiceCard';
import { ServiceOptionsContainer } from './styles';
import { serviceCardSkeleton } from './ServiceCard/skeleton';

const ServiceOptions = () => {
  const { serviceEstimations } = useContext(RidePageContext);
  const isDebuggingEnabled = (typeof atob !== 'undefined');
  return (
    <ServiceOptionsContainer alwaysBounceVertical={false}>
      {(serviceEstimations || []).map(option => <ServiceCard service={option} />)}
      {!isDebuggingEnabled
        ? (
          <SkeletonContent
            containerStyle={{}}
            isLoading={!serviceEstimations}
            layout={[
              serviceCardSkeleton,
              serviceCardSkeleton,
              serviceCardSkeleton,
            ]}
          />
        ) : null}
    </ServiceOptionsContainer>
  );
};

export default ServiceOptions;
