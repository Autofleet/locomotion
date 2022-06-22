import React, { useContext, useState } from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { RidePageContext } from '../../../../../context/newRideContext';
import ServiceCard from './ServiceCard';
import { ServiceOptionsContainer } from './styles';

const ServiceOptions = () => {
  const [selectedService, setSelectedService] = useState(null);
  const { serviceEstimations } = useContext(RidePageContext);

  return (
    <ServiceOptionsContainer alwaysBounceVertical={false}>
      {/* <>
        {(serviceEstimations || []).map(option => <ServiceCard service={option} />)}
      </> */}
      <SkeletonContent
        containerStyle={{}}
        isLoading
        layout={[
          {
            flexDirection: 'column',
            width: '100%',
            padding: 20,
            children: [
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: 20,
                children: [
                  {
                    width: '50%',
                    height: 10,
                  },
                  {
                    width: '20%',
                    height: 10,
                  },
                ],
              },
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '50%',
                marginBottom: 20,
                children: [
                  {
                    width: '10%',
                    height: 10,
                  },
                  {
                    width: '30%',
                    height: 10,
                  },
                ],
              },
              {
                width: '50%',
                height: 10,
              },
            ],
          },
        ]}
          />
    </ServiceOptionsContainer>
  );
};

export default ServiceOptions;
