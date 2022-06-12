import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { useBottomSheetDynamicSnapPoints, BottomSheetView, useBottomSheet } from '@gorhom/bottom-sheet';

import styled from 'styled-components';
import SafeView from '../../../../Components/SafeView';
import TextInput from '../../../../Components/TextInput';
import i18n from '../../../../I18n';
import AddressRow from './AddressLine';
import SearchBar from './SearchBar';

const Container = styled(BottomSheetView)`
  flex: 1;
`;

const ContentContainer = styled(BottomSheetView)`
  align-items: center;
  flex-direction: column;
  padding: 0px 30px 20px 30px;
  width: 100%;
`;

const InputContainer = styled.View`
  width: 100%;
`;

const HistoryContainer = styled.View`
  flex:1;
  margin-bottom: 10px;
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
const AddressSelectorBottomSheet = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['CONTENT_HEIGHT', '100%'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  const handleSheetChanges = useCallback((index) => {
    const newIsExpanded = index === (animatedSnapPoints.value.length - 1);
    if (isExpanded !== newIsExpanded) {
      setIsExpanded(newIsExpanded);
    }
  }, []);

  const onSearchFocus = () => {
    bottomSheetRef.current.expand();
  };

  useEffect(() => {
    console.log('isExpanded', isExpanded);
  }, [isExpanded]);


  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={animatedSnapPoints}
      onChange={handleSheetChanges}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
    >
      <Container>
        <SafeView>
          <ContentContainer
            onLayout={handleContentLayout}
          >
            <InputContainer>
              <SearchBar
                onFocus={onSearchFocus}
              />
            </InputContainer>
            <HistoryContainer>
              {historyText.map(h => <AddressRow {...h} />)}
            </HistoryContainer>
          </ContentContainer>
        </SafeView>
    </Container>
      </BottomSheet>
  );
};

export default AddressSelectorBottomSheet;
