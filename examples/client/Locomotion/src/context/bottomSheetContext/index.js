import React, {
  useState, useEffect, createContext, useMemo, useRef,
} from 'react';
import { View, Text } from 'react-native';
import { BS_PAGES } from '../ridePageStateContext/utils';

export const BottomSheetContext = createContext();

export const SNAP_POINT_STATES = {
  [BS_PAGES.ADDRESS_SELECTOR]: ['15%', '100%'],
  [BS_PAGES.SERVICE_ESTIMATIONS]: ['50%', '95%'],
  [BS_PAGES.CONFIRM_PICKUP]: ['30%', '30%'],
  [BS_PAGES.SET_LOCATION_ON_MAP]: ['30%', '30%'],
  [BS_PAGES.NO_PAYMENT]: ['30%', '30%'],
  [BS_PAGES.NOT_IN_TERRITORY]: ['30%', '30%'],
  [BS_PAGES.CONFIRMING_RIDE]: ['30%', '30%'],
  [BS_PAGES.NO_AVAILABLE_VEHICLES]: ['30%', '30%'],
  [BS_PAGES.ACTIVE_RIDE]: ['30%', '95%'],
  [BS_PAGES.CUSTOM_TIP]: ['70%', '100%'],
};
const BottomSheetProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [childrenState, setChildrenState] = useState(<></>);
  const bottomSheetRef = useRef(null);
  const [snapPointsState, setSnapPointsState] = useState(SNAP_POINT_STATES[BS_PAGES.ADDRESS_SELECTOR]);
  const [footerComponent, setFooterComponent] = useState(null);
  const snapPoints = useMemo(() => snapPointsState, [snapPointsState]);

  const setComponent = (Component) => {
    setChildrenState(Component);
  };

  return (
    <BottomSheetContext.Provider
      value={{
        snapPoints,
        isExpanded,
        setIsExpanded,
        setSnapPointsState,
        setFooterComponent,
        footerComponent,
        childrenState,
        setComponent,
        bottomSheetRef,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetProvider;
