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
  flex: 1;
`;


const InputContainer = styled.View`
  width: 100%;
  display: flex;
`;

const HistoryContainer = styled(BottomSheetView)`
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
  const [resultsList, setResultsList] = useState([]);
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
  /*   const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  const handleSheetChanges = useCallback((index) => {
    const newIsExpanded = index === (animatedSnapPoints.value.length - 1);
    setIsExpanded(newIsExpanded);
  }, []); */

  const onSearchFocus = () => {
    bottomSheetRef.current.expand();
  };

  const onBack = () => {
    bottomSheetRef.current.collapse();
  };

  useEffect(() => {
    setResultsList(historyResults);
  }, []);

  const onSearchTerm = async (searchTerm) => {
    console.log('onSearchTerm', searchTerm);

    if (searchTerm === null || searchTerm === '') {
      setResultsList(historyResults);
    } else {
      const results = await userContext.loadAddress(searchTerm);
      console.log(results);

      const parsed = parseSearchResults(results);
      setResultsList(parsed);
    }
  };

  const onCurrentLocation = async () => {
    const results = await userContext.reverseLocationGeocode();
    console.log('results', results);
  };

  const parseSearchResults = results => results.map(r => ({
    text: r.structured_formatting.main_text,
    subText: r.structured_formatting.secondary_text,
    fullText: `${r.structured_formatting.main_text},${r.structured_formatting.secondary_text}`,
    placeId: r.place_id,
  }));

  return (
  /*     <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={animatedSnapPoints}
      onChange={handleSheetChanges}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
    > */

    /* <SafeView>
       <ContentContainer
        onLayout={handleContentLayout}
      > */
    <>
      <InputContainer>
        <SearchBar
          onFocus={onSearchFocus}
          isExpanded={isExpanded}
          onBack={onBack}
          onSearch={onSearchTerm}
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
        <View
          onLayout={(event) => {
            if (event.nativeEvent.layout.height > 0) {
              setContentHeight(event.nativeEvent.layout.height);
            }
          }}
        >
          {resultsList.map(h => <AddressRow {...h} onPress={() => userContext.onAddressSelected(h)} />)}
        </View>
      </HistoryContainer>
    </>
  /*       </ContentContainer>
    </SafeView> */

  /* </BottomSheet> */
  );
};

export default AddressSelectorBottomSheet;
