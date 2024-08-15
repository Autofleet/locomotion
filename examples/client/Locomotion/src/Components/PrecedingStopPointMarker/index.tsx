import React from 'react';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import { Marker } from 'react-native-maps';
import SvgIcon from '../SvgIcon';
import pickupIcon from '../../assets/map/markers/pickupIcon.svg';

interface PrecedingStopPointMarkerProps {
    stopPoint: any;
}

const PrecedingStopPointMarker = ({ stopPoint }: PrecedingStopPointMarkerProps) => (
  <Marker
    coordinate={{ latitude: parseFloat(stopPoint.lat), longitude: parseFloat(stopPoint.lng) }}
    zIndex={10}
    tracksViewChanges={false}
  >
    <SvgIcon Svg={pickupIcon} width={10} height={10} />
  </Marker>
);

export default PrecedingStopPointMarker;
