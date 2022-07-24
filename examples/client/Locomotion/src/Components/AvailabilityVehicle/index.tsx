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
import carIcon from '../../assets/map/Autofleet_Car_Icon.svg';

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

  const spinValue = new Animated.Value(0);

  useEffect(() => {
    if (location.bearing) {
      setTimeout(() => {
        console.log('here');
        Animated.timing(
          spinValue,
          {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear, // Easing is an additional import from react-native
            useNativeDriver: true, // To make use of native driver for performance
          },
        ).start(() => {
          console.log('here2');
        });
      }, 3000);
    }
  }, [location.bearing]);

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['1deg', '180deg'],
  });
  console.log(spin);
  return (
    <Animated.View
      style={{ transform: [{ rotate: spin }] }}
    >
      <View style={{ width: 20, height: 20, position: 'relative' }}>

        <MarkerAnimated
          key={id}
          ref={markerRef}
          coordinate={locationAnimated}
          style={{ position: 'absolute' }}
        >

          <View>
            <SvgIcon
              Svg={carIcon}
              height={48}
              width={48}
              fill={primaryColor}
            />
          </View>
        </MarkerAnimated>
      </View>

    </Animated.View>

  );
};

export default React.memo(AvailabilityVehicle, areEqual);
