import React, { useContext, useState } from 'react';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import { Marker } from 'react-native-maps';
import moment from 'moment';
import dropoffIcon from '../../assets/map/markers/dropoffIcon.svg';
import pickupIcon from '../../assets/map/markers/pickupIcon.svg';
import Mixpanel from '../../services/Mixpanel';
import {
  InfoBox, Type, SubText, TypeText, MarkerContainer, IconContainer, SubContainer,
} from './styled';
import { RidePageContext } from '../../context/newRideContext';
import i18n from '../../I18n';
import SvgIcon from '../SvgIcon';
import { STOP_POINT_TYPES } from '../../lib/commonTypes';

export default ({
  stopPoint,
}) => {
  const { chosenService, requestStopPoints } = useContext(RidePageContext);
  const { lat, lng } = stopPoint;
  const [minutesUntilPickup] = useState(moment.duration(moment(stopPoint.eta || chosenService.eta).diff(moment())).minutes().toString());
  const etaText = i18n.t('rideDetails.toolTipEta', { minutes: minutesUntilPickup });
  const typeDetails = {
    [STOP_POINT_TYPES.STOP_POINT_PICKUP]: {
      icon: pickupIcon,
      displayName: i18n.t('rideDetails.type.pickup'),
    },
    [STOP_POINT_TYPES.STOP_POINT_DROPOFF]: {
      icon: dropoffIcon,
      displayName: i18n.t('rideDetails.type.dropoff'),
    },
  };

  const checkIfSpIsNext = () => stopPoint.type === STOP_POINT_TYPES.STOP_POINT_PICKUP;
  return (
    <Marker
      coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(lng) }}
      onPress={(e) => {
        Mixpanel.trackElementClick({ id: 'SelectStationButton' });
      }}
      key={stopPoint.id}
      zIndex={999}
      tracksViewChanges={Platform.OS === 'ios' && Config.MAP_PROVIDER === 'google'}
    >
      <MarkerContainer>
        <InfoBox>
          <Type>
            <TypeText>
              {typeDetails[stopPoint.type].displayName}
            </TypeText>
          </Type>
          <SubContainer>
            {checkIfSpIsNext() && (
            <SvgIcon
              Svg={typeDetails[stopPoint.type].icon}
              width={16}
              height={16}
            />
            )}
            <SubText numberOfLines={1}>
              {checkIfSpIsNext() ? etaText : stopPoint.streetAddress}
            </SubText>
          </SubContainer>
        </InfoBox>
        <IconContainer>
          <SvgIcon
            Svg={typeDetails[stopPoint.type].icon}
            width={20}
            height={20}
          />
        </IconContainer>
      </MarkerContainer>
    </Marker>
  );
};
