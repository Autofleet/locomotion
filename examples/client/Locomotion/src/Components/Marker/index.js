import React, { useContext, useState } from 'react';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import { Marker } from 'react-native-maps';
import moment from 'moment';
import dropoffIcon from '../../assets/map/markers/dropoffIcon.svg';
import pickupIcon from '../../assets/map/markers/pickupIcon.svg';
import Mixpanel from '../../services/Mixpanel';
import {
  InfoBox, Type, SubText, TypeText, MarkerContainer, IconContainer, SubContainer, PulseContainer,
} from './styled';
import { RidePageContext } from '../../context/newRideContext';
import i18n from '../../I18n';
import SvgIcon from '../SvgIcon';
import { STOP_POINT_TYPES } from '../../lib/commonTypes';
import Loader from '../Loader';
import pulse from '../../assets/marker-pulse.json';

export default ({
  stopPoint,
}) => {
  const { chosenService } = useContext(RidePageContext);
  const { lat, lng } = stopPoint;
  const eta = stopPoint.eta || (chosenService && chosenService.eta);
  const etaInMinutes = moment.duration(moment(eta).diff(moment())).minutes().toString();
  const [minutesUntilPickup] = useState(etaInMinutes);
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

  const checkIfSpIsNext = () => eta && stopPoint.type === STOP_POINT_TYPES.STOP_POINT_PICKUP;
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
            <PulseContainer>
              <Loader sourceProp={pulse} lottieViewStyle={{ width: 24, height: 24 }} />
            </PulseContainer>
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
