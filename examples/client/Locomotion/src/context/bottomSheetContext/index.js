import React, {
  useState, useEffect, createContext, useMemo,
} from 'react';
import { BS_PAGES } from '../ridePageStateContext/utils';

export const BottomSheetContext = createContext();

export const SNAP_POINT_STATES = {
  [BS_PAGES.ADDRESS_SELECTOR]: ['15%', '100%'],
  [BS_PAGES.SERVICE_ESTIMATIONS]: ['50%', '100%'],
  [BS_PAGES.CONFIRM_PICKUP]: ['30%'],
  [BS_PAGES.SET_LOCATION_ON_MAP]: ['30%'],
  [BS_PAGES.NO_PAYMENT]: ['30%'],
  [BS_PAGES.NOT_IN_TERRITORY]: ['30%'],
  [BS_PAGES.CONFIRMING_RIDE]: ['30%'],
  [BS_PAGES.NO_AVAILABLE_VEHICLES]: ['30%'],
  [BS_PAGES.CONFIRM_PICKUP_TIME]: ['30%'],
  [BS_PAGES.ACTIVE_RIDE]: ['30%', '100%'],
  [BS_PAGES.CUSTOM_TIP]: ['99.999999%', '100%'],
  [BS_PAGES.LOCATION_REQUEST]: ['30%'],
  [BS_PAGES.CANCEL_RIDE]: ['30%'],
  [BS_PAGES.CONFIRM_FUTURE_RIDE]: [340],
};
const BottomSheetProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [snapPointsState, setSnapPointsState] = useState(SNAP_POINT_STATES[BS_PAGES.ADDRESS_SELECTOR]);
  const [footerComponent, setFooterComponent] = useState(null);
  const [topBarText, setTopBarText] = useState('');
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
        topBarText,
        setTopBarText,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetProvider;
