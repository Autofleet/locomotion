import React, {
  useCallback, useEffect, useMemo, useRef, useState, useContext, forwardRef,
} from 'react';
import { View } from 'react-native';
import BottomSheet, {
  useBottomSheetDynamicSnapPoints,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import styled from 'styled-components';
import SafeView from '../../../../Components/SafeView';
import { BottomSheetContext } from '../../../../context/bottomSheetContext';


const BottomSheetComponent = forwardRef(({ children }, ref) => {
  const snapPoints = useMemo(() => ['25%', '100%'], []);
  const {
    setSnapPointIndex,
    sheetState,
    setSheetState,
    setIsExpanded,
  } = useContext(BottomSheetContext);

  const handleSheetChanges = useCallback((index) => {
    setSnapPointIndex(index);
  }, []);

  const onAnimate = useCallback((from, to) => {
    if (from !== -1) {
      if (to > from) {
        setIsExpanded(true);
      }

      if (from > to) {
        setIsExpanded(false);
      }
    }
  }, []);

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onAnimate={onAnimate}
    >
      <SafeView
        style={{
          flex: 1,
          flexDirection: 'column',
        }}
      >
        {children}
      </SafeView>

    </BottomSheet>
  );
});

export default BottomSheetComponent;
