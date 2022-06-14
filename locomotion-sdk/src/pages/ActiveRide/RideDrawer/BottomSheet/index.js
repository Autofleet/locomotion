import React, {
  useCallback, useEffect, useMemo, useRef, useState, useContext, forwardRef,
} from 'react';
import BottomSheet, {
  useBottomSheetDynamicSnapPoints,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import styled from 'styled-components';
import SafeView from '../../../../Components/SafeView';
import { BottomSheetContext } from '../../../../context/bottomSheetContext';

const ContentContainer = styled(BottomSheetView)`
  align-items: center;
  flex-direction: column;
  padding: 0px 30px 20px 30px;
  width: 100%;
  display: flex;

`;

const BottomSheetComponent = forwardRef(({ children }, ref) => {
  const snapPoints = useMemo(() => ['CONTENT_HEIGHT', '100%'], []);
  const { getSnapPoints, setSnapPointIndex } = useContext(BottomSheetContext);


  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(getSnapPoints());

  const handleSheetChanges = useCallback((index) => {
    setSnapPointIndex(index);
  }, []);


  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={animatedSnapPoints}
      onChange={handleSheetChanges}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
    >
      <SafeView>
        <ContentContainer
          onLayout={handleContentLayout}
        >
          {children}

        </ContentContainer>
      </SafeView>

    </BottomSheet>
  );
});

export default BottomSheetComponent;
