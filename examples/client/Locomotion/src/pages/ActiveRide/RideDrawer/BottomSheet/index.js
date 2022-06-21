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
import RideNotes from '../../../../popups/RideNotes';
import { BottomSheetContext } from '../../../../context/bottomSheetContext';

const ContentContainer = styled(BottomSheetView)`
  flex: 1;
`;

const BottomSheetComponent = forwardRef(({ children }, ref) => {
  const snapPoints = useMemo(() => ['CONTENT_HEIGHT', '95%'], []);
  const { getSnapPoints, setSnapPointIndex } = useContext(BottomSheetContext);


  const {
    setSnapPointIndex,
    sheetState,
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
    <>
      <RideNotes />
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onAnimate={onAnimate}
      >
        <SafeView>
          <ContentContainer
            onLayout={handleContentLayout}
          >
            {children}

          </ContentContainer>
        </SafeView>

      </BottomSheet>
    </>
  );
});

export default BottomSheetComponent;
