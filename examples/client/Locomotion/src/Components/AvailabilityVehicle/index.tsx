import React, {
  useContext, useEffect, useRef, useCallback,
} from 'react';
import {
  MarkerAnimated, AnimatedRegion, MapMarker, LatLng,
} from 'react-native-maps';
import { Platform } from 'react-native';
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

interface SvgStyle {
  color: string,
  transform?: { rotate: string }[]
}

/** toValue is ignored in favor of lat/lng, but required by TimingAnimationConfig interface */
const TO_VALUE_PLACEHOLDER = 1;

/** Zero delta maintains current map zoom level during marker animation */
const MAINTAIN_CURRENT_ZOOM = 0;

const DURATION = 5000;

const areEqual = (
  prev: AvailabilityVehicleProps,
  next: AvailabilityVehicleProps,
) => prev.id === next.id
&& prev.location.lat === next.location.lat
&& prev.location.lng === next.location.lng
  && prev.location.bearing === next.location.bearing;

const ensureNumberType = (v: string | number) => {
  if (typeof v === 'string') {
    return parseFloat(v);
  }
  return v;
};
const AvailabilityVehicle = ({
  location,
  id,
}: AvailabilityVehicleProps) => {
  const { useVehicleColor } = useContext(ThemeContext);
  const { vehicleColor } = useVehicleColor();
  const markerRef = useRef<MapMarker>(null);
  const locationAnimationRef = useRef<AnimatedRegion>(
    new AnimatedRegion({
      latitude: ensureNumberType(location.lat),
      longitude: ensureNumberType(location.lng),
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    }),
  );

  useEffect(() => {
    if (location.lat && location.lng) {
      locationAnimationRef.current.timing({
        toValue: TO_VALUE_PLACEHOLDER,
        duration: DURATION,
        longitudeDelta: MAINTAIN_CURRENT_ZOOM,
        latitudeDelta: MAINTAIN_CURRENT_ZOOM,
        useNativeDriver: false,
        latitude: ensureNumberType(location.lat),
        longitude: ensureNumberType(location.lng),
      }).start();
    }
  }, [location?.lat, location?.lng]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      markerRef.current?.redraw();
    }
  }, [vehicleColor, markerRef.current, location?.bearing]);

  const onPressWorkaround = useCallback(() => {
    try {
      markerRef?.current?.hideCallout();
    } catch (e) {
      console.log('error', e);
    }
  }, [markerRef]);

  const svgStyle: SvgStyle = { color: vehicleColor };
  if (location?.bearing) {
    svgStyle.transform = [{ rotate: `${location.bearing}deg` }];
  }

  return (
    <MarkerAnimated
      key={id}
      ref={markerRef}
      coordinate={locationAnimationRef.current as unknown as LatLng}
      anchor={{ x: 0.5, y: 0.40 }}
      tappable={false}
      // tooltip workaround, need to upgrade library
      onPress={onPressWorkaround}
      tracksViewChanges={false}
    >
      <SvgIcon
        Svg={carIcon}
        height={48}
        width={48}
        style={svgStyle}
      />
    </MarkerAnimated>
  );
};

export default React.memo(AvailabilityVehicle, areEqual);
