import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { BottomSheetContext, SNAP_POINT_STATES } from '../bottomSheetContext';
import geo, { getPosition } from '../../services/geo';
import { getUserTerritories } from '../user/api';
import pointInPolygon from './pointInPolygon';
import { BsPages, BS_PAGES } from './utils';

interface RidePageStateContextProps {
  territory: any;
  loadTerritory: () => void;
  initGeoService: () => Promise<void>;
  isUserLocationFocused: boolean;
  setIsUserLocationFocused: (isLocationFocused: boolean) => void;
  currentBsPage: BsPages;
  checkStopPointsInTerritory: (sp: any) => Promise<boolean>;
  changeBsPage: (pageName: BsPages) => void;
}

export const RideStateContextContext = createContext<RidePageStateContextProps>({
  territory: {},
  loadTerritory: () => undefined,
  initGeoService: async () => undefined,
  isUserLocationFocused: false,
  setIsUserLocationFocused: (isLocationFocused: boolean) => undefined,
  currentBsPage: BS_PAGES.ADDRESS_SELECTOR,
  checkStopPointsInTerritory: async () => false,
  changeBsPage: () => undefined,
});

const RideStateContextContextProvider = ({ children }: { children: any }) => {
  const [territory, setTerritory] = useState<Array<any> | null>(null);
  const [isUserLocationFocused, setIsUserLocationFocused] = useState(true);
  const [currentBsPage, setCurrentBsPage] = useState<BsPages>(BS_PAGES.ADDRESS_SELECTOR);
  const { setSnapPointsState, setIsExpanded } = useContext(BottomSheetContext);

  const changeBsPage = (pageName: BsPages) => {
    setIsExpanded(false);
    setSnapPointsState(SNAP_POINT_STATES[pageName]);
    setCurrentBsPage(pageName);
  };
  const setNotInTerritory = () => {
    changeBsPage(BS_PAGES.NOT_IN_TERRITORY);
  };
  const loadTerritory = async (checkTerritory = false) => {
    let t = territory;
    if (!t) {
      t = await getUserTerritories();
      t = t && t.flat();
      setTerritory(t);
    }
    if (t && checkTerritory) {
      const position = await getPosition(changeBsPage);
      const isInsidePoly = pointInPolygon(t, position);
      if (!isInsidePoly) {
        setNotInTerritory();
      }
    }
    return t;
  };

  const checkStopPointsInTerritory = async (stopPoints: any[]) => {
    const isInTerritory = stopPoints.every(sp => pointInPolygon(territory, {
      coords: {
        latitude: sp.lat,
        longitude: sp.lng,
      },
    }));

    if (!isInTerritory) {
      setNotInTerritory();
    }

    return isInTerritory;
  };

  const initGeoService = async () => {
    await geo.initAsync();
    await loadTerritory(true);
  };

  return (
    <RideStateContextContext.Provider
      value={{
        territory,
        loadTerritory,
        initGeoService,
        isUserLocationFocused,
        setIsUserLocationFocused,
        currentBsPage,
        checkStopPointsInTerritory,
        changeBsPage,
      }}
    >
      {children}
    </RideStateContextContext.Provider>
  );
};


export default RideStateContextContextProvider;
