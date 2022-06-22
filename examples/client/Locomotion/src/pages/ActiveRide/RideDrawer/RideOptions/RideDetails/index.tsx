import React, { useContext } from 'react';
import { Text, Button } from 'react-native';
import { RidePageContext } from '../../../../../context/newRideContext';

const RideDetails = () => {
  const { requestStopPoints, chosenService, requestRide } = useContext(RidePageContext) as any;
  return (
    <Text>
      <Button title="TEMP" onPress={requestRide} />
    </Text>
  );
};

export default RideDetails;
