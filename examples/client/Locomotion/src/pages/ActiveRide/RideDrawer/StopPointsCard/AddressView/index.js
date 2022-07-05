import React, {
  useState, useEffect, useContext,
} from 'react';
import { ScrollView, View } from 'react-native';
import Config from 'react-native-config';
import { UserContext } from '../../../../../context/user';
import { getPosition } from '../../../../../services/geo';

import I18n from '../../../../../I18n';
import {
  AddressInputs,
  Address,
  AddressTextInput,
  AddressSearchItem,
  AddressSearchItemText,
  DistanceFromAddress,
  ResetInputIconContainer,
  ResetInputIcon,
  StationIcon,
} from './styled';
import { getLocation, getPlacesByLocation } from '../../../../../context/places/api';
import { RideStateContextContext } from '../../../../..';

export default (props) => {
  const [searchText, setSearchText] = useState(
    props.requestStopPoints[props.type]
      && props.requestStopPoints[props.type].description,
  );
  const [addressListItems, setAddressListItems] = useState(null);
  const { setLocationGranted } = useContext(UserContext);
  const [coords, setCoords] = useState({});
  const {
    changeBsPage,
  } = useContext(RideStateContextContext);
  useEffect(() => {
    initCurrentLocation();
  }, []);

  const initCurrentLocation = async () => {
    const { coords: newCord } = await getPosition(changeBsPage, setLocationGranted);
    setCoords(newCord);
  };

  const enrichPlaceWithLocation = async (place) => {
    const data = await getLocation({
      placeId: place.placeid || place.place_id,
    });
    place = { ...place, ...data };
    return place;
  };

  const setPlace = async (place) => {
    if (!place.lat && (place.placeid || place.place_id)) {
      place = await enrichPlaceWithLocation(place);
    }
    if (Config.DONT_USE_STATIONS || place.station) {
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
    } else {
      setAddressListItems({
        type: addressListItems.type,
        list: [],
      });
      setSearchValue(place.description, props.type, true, place);
    }
  };

  const loadAddress = async (input, showStations, selectedPlace = null) => {
    let location = null;
    try {
      if (selectedPlace) {
        location = {
          lat: selectedPlace.lat,
          lng: selectedPlace.lng,
        };
      } else {
        location = { lat: coords.latitude, lng: coords.longitude };
      }

      const data = await getPlacesByLocation({
        input,
        location,
        stations: showStations,
      });
      return data;
    } catch (error) {
      console.log('Got error while try to get places', error);
      return undefined;
    }
  };

  const setSearchValue = async (value, type, showStations = null, place) => {
    setSearchText(value);
    setAddressListItems({
      type,
      ...{
        list: value ? await loadAddress(value, showStations, place) : undefined,
      },
    });
  };

  return (
    <AddressInputs>
      <Address>
        <AddressTextInput
          value={searchText}
          onChangeText={value => setSearchValue(value, props.type)}
          autoFocus
          placeholder={I18n.t('addressView.addressPlaceholder')}
        />
      </Address>

      <ScrollView keyboardShouldPersistTaps="handled">
        {addressListItems
          && addressListItems.list
          && addressListItems.list.map(item => (
            <AddressSearchItem key={item.id} onPress={() => setPlace(item)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.station ? <StationIcon /> : null}
                <AddressSearchItemText>{item.description}</AddressSearchItemText>
              </View>
              {item.distance !== null && item.distanceFromMe ? (
                <DistanceFromAddress>
                  {I18n.t('popups.rideSummary.distanceValue', {
                    distance: item.distanceFromMe.toFixed(2),
                  })}
                </DistanceFromAddress>
              ) : null}
            </AddressSearchItem>
          ))}
      </ScrollView>
      <ResetInputIconContainer onPress={props.onClose} data-test-id="ClearAddressButton">
        <ResetInputIcon />
      </ResetInputIconContainer>
    </AddressInputs>
  );
};
