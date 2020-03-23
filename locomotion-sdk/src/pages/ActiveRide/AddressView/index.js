import React, { useState, useRef, Fragment } from 'react';
import { ScrollView } from 'react-native'
import getPosition from './getPostion';
import network from '../../../services/network';
import {
  View,
} from 'react-native';
import I18n from '../../../I18n';
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
} from './styled';

export default (props) => {
  const dropoffTextField = useRef();
  const [searchPickupText, setSearchPickupText] = useState(
    props.requestStopPoints.pickup
    && props.requestStopPoints.pickup.description,
  );
  const [searchDropoffText, setSearchDropoffText] = useState(
    props.requestStopPoints.dropoff
    && props.requestStopPoints.dropoff.description,
  );
  const [addressListItems, setAddressListItems] = useState(null);

  const enrichPlaceWithLocation = async (place) => {
    const { data } = await network.get('api/v1/me/places/get-location', { params: {
      placeId: (place.placeid || place.place_id),
    } });
    place = { ...place, ...data };
    return place;
  }

  const setPlace = async (place) => {
    if (addressListItems.type === 'pickup') {
      setSearchPickupText(place.description);
      dropoffTextField.current.focus();
    } else {
      setSearchDropoffText(place.description);
    }

    if (!place.lat && (place.placeid || place.place_id)) {
      place = await enrichPlaceWithLocation(place);
    }

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
  };

  const loadAddress = async (input) => {
    try {
      const { coords } = await getPosition();
      const { data } = await network.get('api/v1/me/places', { params: {
        input,
        location: { lat: coords.latitude, lng: coords.longitude }
      } });

      return data;
    } catch (error) {
      console.log('Got error while try to get places', error);
      return undefined;
    }

  };

  const setSearchValue = async (value, type) => {
    if (type === 'dropoff') {
      setSearchDropoffText(value);
    } else {
      setSearchPickupText(value);
    }
    console.log('loadAddressloadAddress', value);

    setAddressListItems({
      type,
      ...{ list: value ? await loadAddress(value) : undefined, },
    });
  };

  return (
    <AddressInputs>
      <AddressInputsHeader>
        <View>
          <Address originRow>
            <RoutePointsContainer topLine>
              <View style={{ height: 0 }} />
              <OriginDot />
              <PointsLine />
            </RoutePointsContainer>
            <AddressTextInput
              value={searchPickupText}
              onChangeText={value => setSearchValue(value, 'pickup')}
              autoFocus
              placeholder={I18n.t('addressView.pickupPlaceholder')}
            />
          </Address>
          <Address>
            <RoutePointsContainer bottomLine>
              <PointsLine />
              <DestinationDot />
            </RoutePointsContainer>
            <AddressTextInput
              value={searchDropoffText}
              onChangeText={value => setSearchValue(value, 'dropoff')}
              placeholder={I18n.t('addressView.dropoffPlaceholder')}
              inputRef={dropoffTextField}
            />
          </Address>
        </View>
      </AddressInputsHeader>
      <ScrollView>
        {addressListItems && addressListItems.list && addressListItems.list.map(item => (
          <AddressSearchItem
            key={item.id}
            onPress={() => setPlace(item)}
          >
            <AddressSearchItemText>
              {item.description}
            </AddressSearchItemText>
            {item.distance ?
            <DistanceFromAddress>
              {item.distance ? `${item.distanceFromMe.toFixed(2)}km` : null}
            </DistanceFromAddress> : null}
          </AddressSearchItem>
        ))}
      </ScrollView>
    </AddressInputs>
  );
};
