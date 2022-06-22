import React, {
  useState, useEffect, useRef, createContext, useCallback, useMemo,
} from 'react';

export const BottomSheetContext = createContext();

export const SNAP_POINT_STATES = {
  ADDRESS_SELECTOR: ['15%', '100%'],
  SERVICE_ESTIMATIONS: ['50%', '95%'],
  CONFIRM_PICKUP: ['25%'],
};
const BottomSheetProvider = ({ navigation, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [snapPointsState, setSnapPointsState] = useState(SNAP_POINT_STATES.ADDRESS_SELECTOR);
  const [snapPointIndex, setSnapPointIndex] = useState(0);
  const [footerComponent, setFooterComponent] = useState(null);
  const snapPoints = useMemo(() => snapPointsState, [snapPointsState]);

  useEffect(() => {
    const newIsExpanded = snapPointIndex === (snapPointsState.length - 1);
    setIsExpanded(newIsExpanded);
  }, [snapPointIndex]);

  return (
    <BottomSheetContext.Provider
      value={{
        snapPoints,
        isExpanded,
        snapPointIndex,
        setSnapPointIndex,
        setIsExpanded,
        setSnapPointsState,
        setFooterComponent,
        footerComponent,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetProvider;
