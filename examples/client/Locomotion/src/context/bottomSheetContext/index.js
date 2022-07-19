import React, {
  useState, useEffect, createContext, useMemo,
} from 'react';
import { BS_PAGES } from '../ridePageStateContext/utils';

export const BottomSheetContext = createContext();

const STATIC_SNAP_POINTS = 205;

export const SNAP_POINT_STATES = {
  [BS_PAGES.ADDRESS_SELECTOR]: [120, '100%'],
  [BS_PAGES.SERVICE_ESTIMATIONS]: [355, '100%'],
  [BS_PAGES.CONFIRM_PICKUP]: [STATIC_SNAP_POINTS],
  [BS_PAGES.SET_LOCATION_ON_MAP]: [STATIC_SNAP_POINTS],
  [BS_PAGES.NO_PAYMENT]: [STATIC_SNAP_POINTS],
  [BS_PAGES.NOT_IN_TERRITORY]: [STATIC_SNAP_POINTS],
  [BS_PAGES.CONFIRMING_RIDE]: [STATIC_SNAP_POINTS],
  [BS_PAGES.NO_AVAILABLE_VEHICLES]: [STATIC_SNAP_POINTS],
  [BS_PAGES.ACTIVE_RIDE]: [275, '100%'],
  [BS_PAGES.CONFIRM_PICKUP_TIME]: [250],
  [BS_PAGES.CUSTOM_TIP]: ['99.999999%', '100%'],
  [BS_PAGES.LOCATION_REQUEST]: [STATIC_SNAP_POINTS],
  [BS_PAGES.CANCEL_RIDE]: [STATIC_SNAP_POINTS],
  [BS_PAGES.CONFIRM_FUTURE_RIDE]: [350],
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
