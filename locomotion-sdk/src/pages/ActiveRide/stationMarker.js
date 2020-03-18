import React from 'react';
import {Callout, Marker} from 'react-native-maps';
import I18n from '../../I18n';
import {ExitMarkerToolTip, MarkerToolTipText, PickupDot, PickupMarkerToolTip, StationDot, DropoffDot} from "./styled";

export default ({stationKey, lat, lng, selectStation, requestStopPoints, isInOffer}) => {
    const pickup = requestStopPoints.pickup && requestStopPoints.pickup.lng === lng && requestStopPoints.pickup.lat === lat;
    const dropoff = requestStopPoints.dropoff && requestStopPoints.dropoff.lng === lng && requestStopPoints.dropoff.lat === lat;
    return (
        <Marker
            key={'station$' + stationKey}
            coordinate={{latitude: lat, longitude: lng}}
            onPress={pickup ? null : (e) => selectStation(stationKey)}
        >
            {pickup ? <PickupDot/> : dropoff ? <DropoffDot/> : !isInOffer ? <StationDot/> : null}
            <Callout tooltip>
                {pickup ?
                    <PickupMarkerToolTip>
                        <MarkerToolTipText>{I18n.t('home.map.markers.pickup')}</MarkerToolTipText>
                    </PickupMarkerToolTip>
                    :
                    <ExitMarkerToolTip>
                        <MarkerToolTipText>{I18n.t('home.map.markers.dropoff')}</MarkerToolTipText>
                    </ExitMarkerToolTip>
                }
            </Callout>
        </Marker>
    );
};
