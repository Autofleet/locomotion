import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import { Platform, View } from 'react-native';
import styled from 'styled-components';
import { MarkerAnimated, AnimatedRegion } from 'react-native-maps';
import { Context as ThemeContext } from '../../context/theme';
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

const AvailabilityVehicleContainer = styled(View)`
z-index: 100;
`;

const DURATION = 5000;

const areEqual = (prev: AvailabilityVehicleProps, next: AvailabilityVehicleProps) => prev.id === next.id
  && prev.location.lat === next.location.lat
  && prev.location.lng === next.location.lng
  && prev.location.bearing === next.location.bearing;


const AvailabilityVehicle = ({
  location,
  id,
}: AvailabilityVehicleProps) => {
  const { primaryColor } = useContext(ThemeContext);

  const markerRef = useRef<MarkerAnimated>(null);
  const [locationAnimated] = useState(new AnimatedRegion({
    latitude: location.lat,
    latitudeDelta: 0.1,
    longitude: location.lng,
    longitudeDelta: 0.1,
  }));

  useEffect(() => {
    if (location.lat && location.lng) {
      if (Platform.OS === 'android') {
        setTimeout(() => {
          markerRef?.current?.animateMarkerToCoordinate({
            latitude: location.lat,
            longitude: location.lng,
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
    >
      <SvgIcon Svg={carIcon} height={48} width={48} fill={primaryColor} />
    </MarkerAnimated>
  );
};

export default React.memo(AvailabilityVehicle, areEqual);
