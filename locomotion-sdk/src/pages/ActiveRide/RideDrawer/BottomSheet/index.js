import React, {
  useCallback, useEffect, useMemo, useRef, useState, useContext, Children,
} from 'react';
import BottomSheet, {
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';

const BottomSheetComponent = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['33%', '95%'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  const handleSheetChanges = useCallback((index) => {
    const newIsExpanded = index === (animatedSnapPoints.value.length - 1);
    setIsExpanded(newIsExpanded);
  }, []);


  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
    >
      {children}
    </BottomSheet>
  );
};

export default BottomSheetComponent;
