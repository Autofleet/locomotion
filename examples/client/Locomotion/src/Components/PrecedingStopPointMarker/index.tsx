import React, { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Marker } from 'react-native-maps';
import SvgIcon from '../SvgIcon';
import pickupIcon from '../../assets/map/markers/pickupIcon.svg';

interface PrecedingStopPointMarkerProps {
    stopPoint: any;
}

// Same Android react-native-maps bitmap-snapshot issue as the main Marker:
// start with tracksViewChanges=true so SVG child paints, force an Android
// redraw on layout, then freeze the bitmap. See ../Marker/index.js.
const PrecedingStopPointMarker = ({ stopPoint }: PrecedingStopPointMarkerProps) => {
  const markerRef = useRef<any>(null);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const onMarkerLayout = useCallback(() => {
    if (Platform.OS === 'android' && markerRef.current?.redraw) {
      markerRef.current.redraw();
    }
    setTracksViewChanges(prev => (prev ? false : prev));
  }, []);
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
