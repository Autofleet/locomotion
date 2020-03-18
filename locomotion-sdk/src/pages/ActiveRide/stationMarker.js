import React from 'react';
import {Callout, Marker} from 'react-native-maps';
import I18n from '../../I18n';
import {ExitMarkerToolTip, MarkerToolTipText, PickupDot, PickupMarkerToolTip, StationDot, DropoffDot, MarkerContainer} from "./styled";

const PickupMarker = () => (
    <MarkerContainer>
        <PickupMarkerToolTip>
            <MarkerToolTipText>{I18n.t('home.map.markers.pickup')}</MarkerToolTipText>
        </PickupMarkerToolTip>
        <PickupDot/>
    </MarkerContainer>
);

const DropoffMarker = () => (
    <MarkerContainer>
        <ExitMarkerToolTip>
            <MarkerToolTipText>{I18n.t('home.map.markers.dropoff')}</MarkerToolTipText>
        </ExitMarkerToolTip>
        <DropoffDot/>
    </MarkerContainer>
);

const StationMarker = () => (
    <MarkerContainer>
        <StationDot/>
    </MarkerContainer>
);

export default ({stationKey, lat, lng, selectStation, requestStopPoints, isInOffer}) => {
    const pickup = requestStopPoints.pickup && requestStopPoints.pickup.lng === lng && requestStopPoints.pickup.lat === lat;
    const dropoff = requestStopPoints.dropoff && requestStopPoints.dropoff.lng === lng && requestStopPoints.dropoff.lat === lat;
    return (
        <Marker
            coordinate={{latitude: lat, longitude: lng}}
            onPress={pickup || dropoff ? null : (e) => selectStation(stationKey)}
        >
            {pickup ? <PickupMarker/> : dropoff ? <DropoffMarker/> : !isInOffer ? <StationMarker/> : null}
        </Marker>
    );
};
