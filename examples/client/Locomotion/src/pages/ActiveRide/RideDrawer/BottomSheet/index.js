import React, {
  useCallback, useEffect, useMemo, useRef, useState, useContext, forwardRef,
} from 'react';
import BottomSheet, {
  useBottomSheetDynamicSnapPoints,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import styled from 'styled-components';
import SafeView from '../../../../Components/SafeView';
import RideNotes from '../../../../popups/RideNotes';
import ChoosePaymentMethod from '../../../../popups/ChoosePaymentMethod';
import { BottomSheetContext } from '../../../../context/bottomSheetContext';

const ContentContainer = styled(BottomSheetView)`
  align-items: center;
  flex-direction: column;
  padding: 0px 30px 20px 30px;
  width: 100%;
  flex: 1;

`;

const BottomSheetComponent = forwardRef(({ children }, ref) => {
  const [paymentMethodPopupOpen, setPaymentMethodPopupOpen] = useState(true);
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
    <>
      <RideNotes />
      <ChoosePaymentMethod isVisible={paymentMethodPopupOpen} setIsVisible={setPaymentMethodPopupOpen} />
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
    </>
  );
});

export default BottomSheetComponent;
