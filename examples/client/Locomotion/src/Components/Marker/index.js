import React, { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import { Marker } from 'react-native-maps';
import moment from 'moment';
import dropoffIcon from '../../assets/map/markers/dropoffIcon.svg';
import pickupIcon from '../../assets/map/markers/pickupIcon.svg';
import Mixpanel from '../../services/Mixpanel';
import {
  InfoBox, Type, SubText, TypeText, IconContainer, SubContainer, PulseContainer,
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
  const eta = stopPoint.plannedArrivalTime || (chosenService && chosenService.plannedArrivalTime);
  const [minutesUntilPickup, setMinutesUntilPickup] = useState();
  const etaText = minutesUntilPickup > 1
    ? i18n.t('rideDetails.toolTipEta', { minutes: minutesUntilPickup })
    : i18n.t('general.now');
  const typeDetails = {
    [STOP_POINT_TYPES.STOP_POINT_PICKUP]: {
      Icon: <SvgIcon
        Svg={pickupIcon}
        width={20}
        height={20}
        style={{ top: Platform.OS === 'ios' ? -35 : 0 }}
      />,
      displayName: i18n.t('rideDetails.type.pickup'),
    },
    [STOP_POINT_TYPES.STOP_POINT_DROPOFF]: {
      Icon: <SvgIcon
        Svg={dropoffIcon}
        width={25}
        height={50}
        style={{ top: Platform.OS === 'ios' ? -35 : 0 }}
      />,
      displayName: i18n.t('rideDetails.type.dropoff'),
    },
  };

  useEffect(() => {
    const etaInMinutes = moment.duration(moment(eta).diff(moment())).minutes().toString();
    setMinutesUntilPickup(etaInMinutes);
  }, [chosenService]);
  const checkIfSpIsNext = () => eta && stopPoint.type === STOP_POINT_TYPES.STOP_POINT_PICKUP;
  return (
    <Marker
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
          {checkIfSpIsNext() && (
            <PulseContainer>
              <Loader
                sourceProp={pulse}
                lottieViewStyle={{ width: 24, height: 24, marginRight: 5 }}
              />
            </PulseContainer>
          )}
          <SubText numberOfLines={1}>
            {checkIfSpIsNext() ? etaText : stopPoint.streetAddress}
          </SubText>
        </SubContainer>
      </InfoBox>
      <IconContainer>
        {typeDetails[stopPoint.type].Icon}
      </IconContainer>
    </Marker>
  );
};
