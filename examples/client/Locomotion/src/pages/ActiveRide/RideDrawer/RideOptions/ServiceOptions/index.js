import React, { useContext, useEffect } from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { RidePageContext } from '../../../../../context/newRideContext';
import ServiceCard from './ServiceCard';
import { ServiceOptionsContainer } from './styles';
import { serviceCardSkeleton } from './ServiceCard/skeleton';
import { BottomSheetContext } from '../../../../../context/bottomSheetContext';
import i18n from '../../../../../I18n';

const ServiceOptions = () => {
  const { serviceEstimations, stopRequestInterval } = useContext(RidePageContext);
  const isDebuggingEnabled = (typeof atob !== 'undefined');
  const {
    setTopBarText,
  } = useContext(BottomSheetContext);
  useEffect(() => () => stopRequestInterval(), []);

  useEffect(() => {
    if ((serviceEstimations || []).some(estimation => estimation.isPriceEstimated)) {
      setTopBarText(i18n.t('rideDetails.estimatedFareMessage'));
    }

    return () => setTopBarText('');
  }, [serviceEstimations]);


  return (
    <ServiceOptionsContainer alwaysBounceVertical={false}>
      {(serviceEstimations || []).map(option => (
        <ServiceCard
          testID={`Service_${option.id}`}
          withBorder
          service={option}
          key={option.name}
        />
      ))}
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
