import React, {
  useEffect, useContext,
} from 'react';
import {
  View,
} from 'react-native';
import {
  BottomSheetView,
  useBottomSheet,
} from '@gorhom/bottom-sheet';

import styled from 'styled-components';
import SafeView from '../../../../Components/SafeView';
import TextInput from '../../../../Components/TextInput';
import i18n from '../../../../I18n';
import AddressRow from './AddressLine';
import SearchBar from './SearchBar';
import { RidePageContext } from '../../../../context/newRideContext';
import { BottomSheetContext } from '../../../../context/bottomSheetContext';

const Container = styled(BottomSheetView)`
  display: flex;
  width: 100%;
`;


const InputContainer = styled.View`
  width: 100%;
  display: flex;
`;

const HistoryContainer = styled.View`
  margin-bottom: 10px;
  width: 100%;
`;

const AddressContainer = styled.View`
  padding: 0px 30px 20px 30px;
`;


const AddressActionsText = styled.Text`
    color: ${({ theme }) => theme.primaryColor};
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
`;

const historyText = [
  {
    text: '57th Street',
    subText: 'New York, NY, USA',
    icon: 'history',
    lat: 32.444,
    lng: 34.555,
  },
  {
    text: '57th Street',
    subText: 'New York, NY, USA',
    icon: 'history',
    lat: 32.444,
    lng: 34.555,
  },
  {
    text: '57th Strexxxxxet',
    subText: 'New York, NY, USA',
    icon: 'history',
    lat: 32.444,
    lng: 34.555,
  },
];
const AddressSelectorBottomSheet = ({ bottomSheetRef }) => {
  const userContext = useContext(RidePageContext);

  const {
    isExpanded,
  } = useContext(BottomSheetContext);

  const { expand, collapse } = useBottomSheet();


  const loadHistory = async () => {
    userContext.getLastAddresses();
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const onSearchFocus = () => {
    if (!isExpanded) {
      expand();
    }
  };

  const onBack = () => {
    collapse();
  };

  const onCurrentLocation = async () => {
    userContext.setSpCurrentLocation();
  };
  return (
    <AddressContainer>
      <InputContainer>
        <SearchBar
          onFocus={onSearchFocus}
          isExpanded={isExpanded}
          onBack={onBack}
          onSearch={userContext.searchAddress}
        />
      </InputContainer>
      <HistoryContainer>
        {isExpanded
          ? (
            <>
              <AddressRow
                border={false}
                text={i18n.t('addressView.currentLocation')}
                icon="location"
                actionButton
                onPress={onCurrentLocation}
              />
              <AddressRow
                border={false}
                text={i18n.t('addressView.setLocationOnMap')}
                icon="locationPin"
                actionButton
              />
            </>
          )
          : null}
        <View>
          {(userContext.searchResults || userContext.historyResults).map(h => <AddressRow {...h} onPress={() => userContext.onAddressSelected(h)} />)}
        </View>
      </HistoryContainer>
    </AddressContainer>
  );
};

export default AddressSelectorBottomSheet;
