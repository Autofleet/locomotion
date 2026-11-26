import React, { useRef } from 'react';
import { Marker } from 'react-native-maps';
import SvgIcon from '../SvgIcon';
import pickupIcon from '../../assets/map/markers/pickupIcon.svg';
import { useMarkerTracksViewChanges } from '../Marker/useMarkerTracksViewChanges';

interface PrecedingStopPointMarkerProps {
    stopPoint: any;
}

const PrecedingStopPointMarker = ({ stopPoint }: PrecedingStopPointMarkerProps) => {
  const markerRef = useRef<any>(null);
  const { tracksViewChanges, onMarkerLayout } = useMarkerTracksViewChanges(markerRef);
  return (
    <Marker
      ref={markerRef}
      coordinate={{ latitude: parseFloat(stopPoint.lat), longitude: parseFloat(stopPoint.lng) }}
      zIndex={10}
      tracksViewChanges={tracksViewChanges}
      onLayout={onMarkerLayout}
    >
      <SvgIcon Svg={pickupIcon} width={10} height={10} />
    </Marker>
  );
};

export default PrecedingStopPointMarker;
