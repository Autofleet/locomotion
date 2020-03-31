import React, { useState, useRef, Fragment } from 'react';
import {
  ScrollView,
  View,
} from 'react-native';
import getPosition from './getPostion';
import network from '../../../../../services/network';

import I18n from '../../../../../I18n';
import {
  AddressInputs,
  AddressInputsHeader,
  Address,
  AddressTextInput,
  OriginDot,
  DestinationDot,
  PointsLine,
  RoutePointsContainer,
  AddressSearchItem,
  AddressSearchItemText,
  DistanceFromAddress,
  HeaderContainer,
  HeaderIconContainer,
  HeaderIcon,
  ResetInputIconContainer,
  ResetInputIcon
} from './styled';
import PageHeader from '../../../../../Components/PageHeader';
import SafeView from '../../../../../Components/SafeView';

const closeIconSource = require('../../../../../assets/arrow-back.png');

export default (props) => {

  const [searchText, setSearchText] = useState(
    props.requestStopPoints[props.type]
    && props.requestStopPoints[props.type].description,
  );

  const [addressListItems, setAddressListItems] = useState(null);

  const enrichPlaceWithLocation = async (place) => {
    const { data } = await network.get('api/v1/me/places/get-location', {
      params: {
        placeId: (place.placeid || place.place_id),
      },
    });
    place = { ...place, ...data };
    return place;
  };

  const setPlace = async (place) => {
    setAddressListItems({
      type: addressListItems.type,
      list: [],
    });
    setSearchValue(place.description, props.type, true);

    if (!place.lat && (place.placeid || place.place_id)) {
      place = await enrichPlaceWithLocation(place);
    }

    if(place.station) {
      if (props.onLocationSelect) {
        props.onLocationSelect({
          ...place,
          type: addressListItems.type,
        });
      }
      setAddressListItems({
        type: addressListItems.type,
        list: [],
      });

    }

/*    */
  };

  const loadAddress = async (input, showStations) => {
    try {
      const { coords } = await getPosition();
      const { data } = await network.get('api/v1/me/places', {
        params: {
          input,
          location: { lat: coords.latitude, lng: coords.longitude },
          stations:showStations
        },
      });

      return data;
    } catch (error) {
      console.log('Got error while try to get places', error);
      return undefined;
    }
  };

  const setSearchValue = async (value, type, showStations = null) => {
    setSearchText(value);

    setAddressListItems({
      type,
      ...{ list: value ? await loadAddress(value,showStations) : undefined },
    });
  };

  return (
    <AddressInputs>
      <Address>
        <AddressTextInput
          value={searchText}
          onChangeText={value => setSearchValue(value, props.type)}
          autoFocus
          placeholder={I18n.t('addressView.pickupPlaceholder')}
        />
      </Address>

      <ScrollView>
        {addressListItems && addressListItems.list && addressListItems.list.map(item => (
          <AddressSearchItem
            key={item.id}
            onPress={() => setPlace(item)}
          >
            <AddressSearchItemText>
              {item.description}
            </AddressSearchItemText>
            {item.distance
              ? (
                <DistanceFromAddress>
                  {item.distance ? `${item.distanceFromMe.toFixed(2)}km` : null}
                </DistanceFromAddress>
              ) : null}
          </AddressSearchItem>
        ))}
      </ScrollView>
      <ResetInputIconContainer onPress={props.onClose}>
        <ResetInputIcon />
      </ResetInputIconContainer>
    </AddressInputs>
  );
};
