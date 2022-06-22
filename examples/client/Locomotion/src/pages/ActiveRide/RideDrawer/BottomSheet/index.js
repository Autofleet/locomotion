import React, {
  useCallback, useEffect, useMemo, useRef, useState, useContext, forwardRef,
} from 'react';
import BottomSheet, {
  useBottomSheetDynamicSnapPoints,
  BottomSheetView,
  BottomSheetFooter,
} from '@gorhom/bottom-sheet';
import styled from 'styled-components';
import SafeView from '../../../../Components/SafeView';
import ChoosePaymentMethod from '../../../../popups/ChoosePaymentMethod';
import { BottomSheetContext } from '../../../../context/bottomSheetContext';

const ContentContainer = styled(BottomSheetView)`
  flex: 1;
`;

const BottomSheetComponent = forwardRef(({ children }, ref) => {
  const {
    setSnapPointIndex,
    sheetState,
    setIsExpanded,
    snapPoints,
    snapPointIndex,
    footerComponent
  } = useContext(BottomSheetContext);

  const handleSheetChanges = useCallback((index) => {
    setSnapPointIndex(index);
  }, []);

  const onAnimate = useCallback((from, to) => {
    if (from !== -1) {
      setIsExpanded(to > from);
    }
  }, []);

  const renderFooter = useCallback(
    props => (
      footerComponent && <BottomSheetFooter {...props} bottomInset={24}>
          {footerComponent}
      </BottomSheetFooter>
    ),
    [footerComponent]
  );


  return (
    <>      
      <BottomSheet
        ref={ref}
        index={snapPointIndex}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onAnimate={onAnimate}
        footerComponent={renderFooter}
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
    </>
  );
});

export default BottomSheetComponent;
