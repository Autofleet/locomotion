import React, {
  useState, useEffect, useRef, createContext, useCallback, useMemo,
} from 'react';
import { BS_PAGES } from '../ridePageStateContext/utils';

export const BottomSheetContext = createContext();

export const SNAP_POINT_STATES = {
  [BS_PAGES.ADDRESS_SELECTOR]: ['15%', '100%'],
  [BS_PAGES.SERVICE_ESTIMATIONS]: ['50%', '95%'],
  [BS_PAGES.CONFIRM_PICKUP]: ['30%'],
  [BS_PAGES.SET_LOCATION_ON_MAP]: ['30%'],
  [BS_PAGES.NO_PAYMENT]: ['30%'],
  [BS_PAGES.NOT_IN_TERRITORY]: ['30%'],
};
const BottomSheetProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [snapPointsState, setSnapPointsState] = useState(SNAP_POINT_STATES[BS_PAGES.ADDRESS_SELECTOR]);
  const [footerComponent, setFooterComponent] = useState(null);
  const snapPoints = useMemo(() => snapPointsState, [snapPointsState]);

  return (
    <BottomSheetContext.Provider
      value={{
        snapPoints,
        isExpanded,
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
