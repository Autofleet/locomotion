import React from 'react';
import {Callout, Marker} from 'react-native-maps';
import I18n from '../../I18n';
import {ExitMarkerToolTip, MarkerToolTipText, PickupDot, PickupMarkerToolTip, StationDot, DropoffDot, MarkerContainer} from "./styled";

const PickupMarkerContainer = () => (
    <MarkerContainer>
        <PickupMarkerToolTip>
            <MarkerToolTipText>{I18n.t('home.map.markers.pickup')}</MarkerToolTipText>
        </PickupMarkerToolTip>
        <PickupDot/>
    </MarkerContainer>
);

const DropoffMarkerContainer = () => (
    <MarkerContainer>
        <ExitMarkerToolTip>
            <MarkerToolTipText>{I18n.t('home.map.markers.dropoff')}</MarkerToolTipText>
        </ExitMarkerToolTip>
        <DropoffDot/>
    </MarkerContainer>
);

const DefaultStationMarkerContainer = () => (
    <MarkerContainer>
        <StationDot/>
    </MarkerContainer>
);

export default ({stationKey, lat, lng, selectStation, requestStopPoints, isInOffer}) => {
    const pickup = requestStopPoints.pickup && requestStopPoints.pickup.lng === lng && requestStopPoints.pickup.lat === lat;
    const dropoff = requestStopPoints.dropoff && requestStopPoints.dropoff.lng === lng && requestStopPoints.dropoff.lat === lat;

    const StationMarker = ({children}) => (
        <Marker
            coordinate={{latitude: lat, longitude: lng}}
            onPress={(e) => selectStation(stationKey, pickup, dropoff)}
        >
            {children}
        </Marker>
    );

    return (pickup ?
        <StationMarker>
            <PickupMarkerContainer/>
        </StationMarker>
        : dropoff ?
            <StationMarker>
                <DropoffMarkerContainer/>
            </StationMarker>
            : !isInOffer ?
                <StationMarker>
                    <DefaultStationMarkerContainer/>
                </StationMarker>
                : null);
};
