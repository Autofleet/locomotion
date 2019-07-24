import React, { useState, useRef } from 'react';
import Config from 'react-native-config';
import axios from 'axios';
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
} from './styled';

const { GOOGLE_MAPS_API_KEY } = Config;

export default (props) => {
  const dropoffTextField = useRef(null);
  const [searchPickupText, setSearchPickupText] = useState(
    props.requestStopPoints.pickup
    && props.requestStopPoints.pickup.description,
  );
  const [searchDropoffText, setSearchDropoffText] = useState(
    props.requestStopPoints.dropoff
    && props.requestStopPoints.dropoff.description,
  );
  const [addressListItems, setAddressListItems] = useState(null);

  const setPlace = async (place) => {
    if (addressListItems.type === 'pickup') {
      setSearchPickupText(place.description);
      dropoffTextField.current.focus();
    } else {
      setSearchDropoffText(place.description);
    }

    const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        key: GOOGLE_MAPS_API_KEY,
        placeid: place.place_id,
      },
    });

    console.log(data.result.geometry.location);

    if (props.onLocationSelect) {
      props.onLocationSelect({
        type: addressListItems.type,
        description: place.description,
        ...data.result.geometry.location,
      });
    }
    setAddressListItems({
      type: addressListItems.type,
      list: [],
    });
  };

  const loadAddress = async (input) => {
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        key: GOOGLE_MAPS_API_KEY,
        input,
      },
    });
    console.log('loadAddressloadAddress', GOOGLE_MAPS_API_KEY);
    return data.predictions;
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
      list: await loadAddress(value),
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
            <View>
              <AddressTextInput value={searchPickupText} onChangeText={value => setSearchValue(value, 'pickup')} autoFocus placeholder={I18n.t('addressView.pickupPlaceholder')} />
            </View>
          </Address>
          <Address>
            <RoutePointsContainer bottomLine>
              <PointsLine />
              <DestinationDot />
            </RoutePointsContainer>
            <View>
              <AddressTextInput value={searchDropoffText} onChangeText={value => setSearchValue(value, 'dropoff')} placeholder={I18n.t('addressView.dropoffPlaceholder')} ref={dropoffTextField} />
            </View>
          </Address>
        </View>
      </AddressInputsHeader>
      <View>
        {addressListItems && addressListItems.list && addressListItems.list.map(item => (
          <AddressSearchItem
            key={item.id}
            onPress={() => setPlace(item)}
          >
            <AddressSearchItemText>
              {item.description}
            </AddressSearchItemText>
          </AddressSearchItem>
        ))}
      </View>
    </AddressInputs>
  );
};
