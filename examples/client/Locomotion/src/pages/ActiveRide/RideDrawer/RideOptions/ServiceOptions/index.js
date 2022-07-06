import React, { useContext, useEffect, useState } from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { RidePageContext } from '../../../../../context/newRideContext';
import ServiceCard from './ServiceCard';
import { ServiceOptionsContainer } from './styles';
import { serviceCardSkeleton } from './ServiceCard/skeleton';

const ServiceOptions = () => {
  const { serviceEstimations, stopRequestInterval } = useContext(RidePageContext);
  const isDebuggingEnabled = (typeof atob !== 'undefined');
  useEffect(() => () => stopRequestInterval(), []);

  return (
    <ServiceOptionsContainer alwaysBounceVertical={false}>
      {(serviceEstimations || []).map(option => <ServiceCard service={option} key={option.name} />)}
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
