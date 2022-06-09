import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, {useBottomSheetSpringConfigs} from '@gorhom/bottom-sheet';
import styled from 'styled-components';
import SafeView from '../../../../Components/SafeView';


const Container = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: red;
`;
const AddressSelectorBottomSheet = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['33%', '66%', '100%'], []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);


  return (
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <SafeView>
          <Container>

          </Container>
        </SafeView>
      </BottomSheet>
  );
};

export default AddressSelectorBottomSheet;