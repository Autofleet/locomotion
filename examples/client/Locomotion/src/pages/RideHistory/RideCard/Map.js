import React, {
  forwardRef, useEffect, useImperativeHandle, useRef,
} from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import { STOP_POINT_TYPES } from '../../../lib/commonTypes';
import { DropoffIconMarker, PickupIconMarker } from '../marker';
import { MarkerTitle } from './styled';
import i18n from '../../../I18n';
import getOrdinal from '../getOrdinal';

const mapStyle = {
  ...StyleSheet.absoluteFillObject,
};

const SpMarker = ({
  lat, lng, type, ordinalDesc,
}) => (
  <Marker
    key={`Marker#${lat}#${lng}#${type}`}
    coordinate={{
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
    }}
    style={{
      alignItems: 'center',
    }}
  >
    <MarkerTitle type={type}>
      {`${ordinalDesc !== 0 ? getOrdinal(ordinalDesc + 1) : ''} ${
        i18n.t(`stopPointsTypes.${type}`)
      }`}
    </MarkerTitle>
    {type === STOP_POINT_TYPES.STOP_POINT_PICKUP ? <PickupIconMarker onMap /> : undefined}
    {type === STOP_POINT_TYPES.STOP_POINT_DROPOFF ? <DropoffIconMarker onMap /> : undefined}
  </Marker>
);

const Map = forwardRef(({
  ride: { stopPoints },
}, ref) => {
  const mapInstance = useRef();
  const isFocused = useIsFocused();


  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (mapInstance && mapInstance.current && mapInstance.current.fitToElements) {
        mapInstance.current.fitToElements(({
          // for android, ignored by ios
          edgePadding: {
            top: 170,
            right: 10,
            bottom: 0,
            left: 10,
          },
          animated: true,
        }));
      }
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, [mapInstance, stopPoints, isFocused]);

  useImperativeHandle(ref, () => ({
    fitToCoordinates: ({ lat, lng }) => setImmediate(() => {
      if (mapInstance && mapInstance.current && mapInstance.current.fitToCoordinates) {
        mapInstance.current.animateCamera({
          center: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
          },
          heading: 0,
          altitude: 1000,
          zoom: 10,
        });
      }
    }),
  }));

  return (
    <MapView
      ref={mapInstance}
      zoom={15}
      style={mapStyle}
      showMyLocation={false}
      followMyLocation={false}
    >
      {stopPoints && stopPoints.map(({
        lat, lng, type, ordinalDesc,
      }) => (lat && lng ? (
        <SpMarker
          key={`Marker#${lat}#${lng}#${type}`}
          {...{
            lat, lng, type, ordinalDesc,
          }}
        />
      ) : (<></>)))}
    </MapView>
  );
});

export default Map;
