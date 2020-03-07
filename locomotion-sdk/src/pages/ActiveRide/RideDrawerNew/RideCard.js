import React from 'react';
import {
  View,
  Image,
} from 'react-native';

import I18n from '../../../I18n';
import {
  RideCard, RideStatusText, RideDetailsText, RideDetailsContainer, DriverAvatar
} from './styled';

export default ({
    activeRide, rideState
  }) => {
      return (<RideCard>
           <RideDetailsContainer>
            <View style={{ flex: 2, textAlign: 'left' }}>
              <Image
                style={{
                  width: 80, height: 30, marginBottom: 10, alignSelf: 'flex-start',
                }}
                source={{ uri: activeRide.vehicle.image }}
              />
              <RideDetailsText> Your car: </RideDetailsText>
              <RideDetailsText>
                {` ${activeRide.vehicle.model} (${activeRide.vehicle.color}) `}
              </RideDetailsText>
              <RideDetailsText>{activeRide.vehicle.license_number}</RideDetailsText>
            </View>

            <View style={{ flex: 1}}>
              <DriverAvatar source={{ uri: activeRide.driver.avatar }} />
              <RideDetailsText> Driver: </RideDetailsText>
              <RideDetailsText>
                {` ${activeRide.driver.first_name} ${activeRide.driver.last_name} `}
              </RideDetailsText>
            </View>
          </RideDetailsContainer>
        </RideCard>);
  }
