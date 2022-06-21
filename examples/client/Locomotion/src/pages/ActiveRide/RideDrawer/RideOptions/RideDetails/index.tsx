import React, { useContext } from 'react';
import { Text, Button } from 'react-native';
import { RidePageContext } from '../../../../../context/newRideContext';
import ServiceCard from './ServiceCard';
import { ServiceOptionsContainer } from './styles';

const RideDetails = () => {
  const { requestStopPoints, chosenService, requestRide } = useContext(RidePageContext) as any;
  console.log({ requestStopPoints });
  return (
    <Text>
      {/* {JSON.stringify(chosenService)}
      {JSON.stringify(requestStopPoints)} */}
      <Button title="TEMP" onPress={requestRide} />
    </Text>
  );
};

export default RideDetails;
