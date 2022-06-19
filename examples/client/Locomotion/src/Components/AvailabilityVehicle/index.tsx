import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import { MarkerAnimated, AnimatedRegion } from 'react-native-maps';
import SvgIcon from '../SvgIcon';
import carIcon from '../../assets/map/car.svg';

interface Location {
  lat: number;
  lng: number;
  bearing: number;
}

interface AvailabilityVehicleProps {
  location: Location;
  id: string;
}

const AvailabilityVehicleContainer = styled(View)``;

const areEqual = (prev: AvailabilityVehicleProps, next: AvailabilityVehicleProps) => prev.id === next.id
  && prev.location.lat === next.location.lat
  && prev.location.lng === next.location.lng
  && prev.location.bearing === next.location.bearing;


const AvailabilityVehicle = (props: AvailabilityVehicleProps) => {
  const [locationAnimated] = useState(new AnimatedRegion({
    latitude: props.location.lat,
    latitudeDelta: 0.1,
    longitude: props.location.lng,
    longitudeDelta: 0.1,
  }));

  useEffect(() => {
    locationAnimated.timing({
      latitude: props.location.lat,
      longitude: props.location.lng,
      useNativeDriver: false,
      duration: 5000,
    }).start();
  }, [props.location]);

  return (
    <AvailabilityVehicleContainer key={props.id}>
      <MarkerAnimated
        coordinate={locationAnimated}
      >
        <SvgIcon Svg={carIcon} height={48} width={48} />
      </MarkerAnimated>
    </AvailabilityVehicleContainer>
  );
};

export default React.memo(AvailabilityVehicle, areEqual);
