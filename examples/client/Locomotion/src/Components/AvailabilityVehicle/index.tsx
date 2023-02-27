import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import {
  Animated, Easing, Platform, Text, View,
} from 'react-native';
import styled from 'styled-components';
import { MarkerAnimated, AnimatedRegion } from 'react-native-maps';
import { Context as ThemeContext } from '../../context/theme';
import SvgIcon from '../SvgIcon';
import carIcon from '../../assets/map/autofleet_car_icon.svg';

interface Location {
  lat: number;
  lng: number;
  bearing: number;
}

interface AvailabilityVehicleProps {
  location: Location;
  id: string;
}

const AvailabilityVehicleContainer = styled(View)`
z-index: 100;
`;

const DURATION = 5000;

const areEqual = (prev: AvailabilityVehicleProps, next: AvailabilityVehicleProps) => prev.id === next.id
  && prev.location.lat === next.location.lat
  && prev.location.lng === next.location.lng
  && prev.location.bearing === next.location.bearing;

const insureNumberType = (v: string | number) => {
  if (typeof v === 'string') {
    return parseFloat(v);
  }
  return v;
};
const AvailabilityVehicle = ({
  location,
  id,
}: AvailabilityVehicleProps) => {
  const { vehicleColor } = useContext(ThemeContext);
  const markerRef = useRef<MarkerAnimated>(null);
  const [locationAnimated] = useState(new AnimatedRegion({
    latitude: insureNumberType(location.lat),
    latitudeDelta: 0.1,
    longitude: insureNumberType(location.lng),
    longitudeDelta: 0.1,
  }));

  useEffect(() => {
    if (location.lat && location.lng) {
      if (Platform.OS === 'android') {
        setTimeout(() => {
          markerRef?.current?.animateMarkerToCoordinate({
            latitude: insureNumberType(location.lat),
            longitude: insureNumberType(location.lng),
          }, DURATION);
        }, 0);
      } else {
        locationAnimated.timing({
          latitude: location.lat,
          longitude: location.lng,
          useNativeDriver: false,
          duration: DURATION,
        }).start();
      }
    }
  }, [location]);

  return (
    <MarkerAnimated
      key={id}
      ref={markerRef}
      coordinate={locationAnimated}
      anchor={{ x: 0.5, y: 0.40 }}
    >
      <SvgIcon
        Svg={carIcon}
        height={48}
        width={48}
        style={{ transform: [{ rotate: `${location.bearing}deg` }], color: vehicleColor }}
      />
    </MarkerAnimated>

  );
};

export default React.memo(AvailabilityVehicle, areEqual);
