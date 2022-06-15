import React, {
  useCallback, useEffect, useMemo, useRef, useState, useContext,
} from 'react';
import {
  View, Text, StyleSheet, ScrollView,
} from 'react-native';
import BottomSheet, {
  useBottomSheetDynamicSnapPoints,
  BottomSheetView,
  useBottomSheet,
  BottomSheetScrollView,
  BottomSheetBackdrop,
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
  background: red;
`;

const Container2 = styled(BottomSheetView)`
  flex: 1;
`;

const InputContainer = styled.View`
  width: 100%;
  display: flex;
`;

const HistoryContainer = styled.View`
  margin-bottom: 10px;
  width: 100%;
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
  // const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState('33%');
  const [historyResults, setHistoryResults] = useState([]);
  const [resultsList, setResultsList] = useState(null);
  // const bottomSheetRef = useRef(null);
  const userContext = useContext(RidePageContext);

  const {
    isExpanded,
  } = useContext(BottomSheetContext);

  const loadHistory = async () => {
    setHistoryResults(historyText);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomSheetRef.current.collapse();
  }, [userContext.isFormReady]);

  const onSearchFocus = () => {
    if (!isExpanded) {
      bottomSheetRef.current.expand();
    }
  };

  const onBack = () => {
    bottomSheetRef.current.collapse();
  };

  const onCurrentLocation = async () => {
    userContext.setSpCurrentLocation();
  };
  return (
    <Container>
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
      <Container2>
        {(userContext.searchResults || historyResults).map(h => <AddressRow {...h} onPress={() => userContext.onAddressSelected(h)} />)}
      </Container2>
      </HistoryContainer>
    </Container>
  );
};

export default AddressSelectorBottomSheet;
