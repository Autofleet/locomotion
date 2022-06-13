import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MapView, { Marker } from 'react-native-maps';
import SvgIcon from '../../../Components/SvgIcon';
import carIcon from '../../../assets/map/car.svg';

interface Location {
    lat: string;
    lng: string;
    bearing: number;
}

interface AvailabilityVehicleProps {
    location: Location;
    id: string;
}

const AvailabilityVehicleContainer = styled.View``;

const AvailabilityVehicle = (props: AvailabilityVehicleProps) => {
  const [locationAnimated] = useState(new MapView.AnimatedRegion({
    latitude: props.location.lat,
    latitudeDelta: 0.1,
    longitude: props.location.lng,
    longitudeDelta: 0.1,
    useNativeDriver: false,
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
      <Marker.Animated
        useNativeDriver={false}
        coordinate={locationAnimated}
      >
        <SvgIcon svg={carIcon} />
      </Marker.Animated>
    </AvailabilityVehicleContainer>
  );
};

export default AvailabilityVehicle;
