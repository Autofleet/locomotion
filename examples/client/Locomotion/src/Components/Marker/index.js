import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import { Marker } from 'react-native-maps';
import { ThemeContext } from 'styled-components';
import clockIcon from '../../assets/bottomSheet/clock.svg';
import dropoffIcon from '../../assets/map/markers/dropoffIcon.svg';
import pickupIcon from '../../assets/map/markers/pickupIcon.svg';
import Mixpanel from '../../services/Mixpanel';
import {
  InfoBox, Type, SubText, TypeText, IconContainer, SubContainer, PulseContainer,
} from './styled';
import i18n from '../../I18n';
import SvgIcon from '../SvgIcon';
import { STOP_POINT_TYPES, STOP_POINT_STATES } from '../../lib/commonTypes';
import Loader from '../Loader';
import pulse from '../../assets/marker-pulse.json';
import VirtualStationComponent from '../VirtualStationComponent';

const StopPointMarker = ({
  stopPoint,
  key,
  isNext,
  etaText,
  isFutureRide,
  isStationsEnabled = false,
}) => {
  const { lat, lng, type } = stopPoint;
  const theme = useContext(ThemeContext);
  const stationIcon = (type: string) => <VirtualStationComponent type={type} isActive style={{ top: Platform.OS === 'ios' ? -35 : 0 }} />;

  const typeDetails = {
    [STOP_POINT_TYPES.STOP_POINT_PICKUP]: {
      Icon: <SvgIcon
        Svg={pickupIcon}
        width={20}
        height={20}
        style={{ top: Platform.OS === 'ios' ? -35 : 0 }}
      />,
      stationIcon: stationIcon(STOP_POINT_TYPES.STOP_POINT_PICKUP),
      displayName: i18n.t('rideDetails.type.pickup'),
    },
    [STOP_POINT_TYPES.STOP_POINT_DROPOFF]: {
      Icon: <SvgIcon
        Svg={dropoffIcon}
        width={25}
        height={50}
        style={{ top: Platform.OS === 'ios' ? -45 : 0 }}
      />,
      stationIcon: stationIcon(STOP_POINT_TYPES.STOP_POINT_DROPOFF),
      displayName: i18n.t('rideDetails.type.dropoff'),
    },
  };

  const getMarkerIcon = () => {
    if (isFutureRide && isNext) {
      return (
        <SvgIcon
          Svg={clockIcon}
          width={12}
          height={12}
          fill={theme.primaryColor}
          style={{ marginRight: 5 }}
        />
      );
    }
    if (isNext) {
      return (
        <PulseContainer>
          <Loader
            sourceProp={pulse}
            lottieViewStyle={{ width: 22, height: 22, marginRight: 5 }}
          />
        </PulseContainer>
      );
    }
  };

  return (
    <Marker
      key={key}
      coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(lng) }}
      zIndex={999}
      tracksViewChanges={Platform.OS === 'ios' && Config.MAP_PROVIDER === 'google'}
    >
      <InfoBox>
        <Type>
          <TypeText>
            {typeDetails[stopPoint.type].displayName}
          </TypeText>
        </Type>
        <SubContainer>
          {getMarkerIcon()}
          <SubText numberOfLines={1}>
            {etaText}
          </SubText>
        </SubContainer>
      </InfoBox>
      <IconContainer>
        {typeDetails[stopPoint.type][isStationsEnabled ? 'stationIcon' : 'Icon']}
      </IconContainer>
    </Marker>
  );
};

export default StopPointMarker;
