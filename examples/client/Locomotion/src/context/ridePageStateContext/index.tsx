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
  showOutOfTerritory: boolean | undefined;
  setShowOutOfTerritory: (outOfTerritory: boolean) => void;
  initGeoService: () => void;
  isUserLocationFocused: boolean;
  setIsUserLocationFocused: (isLocationFocused: boolean) => void;
  currentBsPage: BsPages;
  setCurrentBsPage: (page: BsPages) => void;
  checkStopPointsInTerritory: (sp: any) => Promise<boolean>;
}

export const RideStateContext = createContext<RidePageStateContextProps>({
  territory: {},
  loadTerritory: () => undefined,
  setShowOutOfTerritory: (outOfTerritory: boolean) => undefined,
  initGeoService: () => undefined,
  isUserLocationFocused: false,
  setIsUserLocationFocused: (isLocationFocused: boolean) => undefined,
  currentBsPage: BS_PAGES.ADDRESS_SELECTOR,
  setCurrentBsPage: (page: BsPages) => undefined,
  showOutOfTerritory: false,
  checkStopPointsInTerritory: async () => true,
});

const RideStateContextProvider = ({ children }: { children: any }) => {
  const [territory, setTerritory] = useState<Array<any> | null>(null);
  const [showOutOfTerritory, setShowOutOfTerritory] = useState<boolean | undefined>(false);
  const [isUserLocationFocused, setIsUserLocationFocused] = useState(true);
  const [currentBsPage, setCurrentBsPage] = useState<BsPages>(BS_PAGES.ADDRESS_SELECTOR);
  const { setSnapPointsState } = useContext(BottomSheetContext);

  const loadTerritory = async (checkTerritory = false) => {
    let t = territory;
    if (!t) {
      t = await getUserTerritories();
      t = t && t.flat();
      setTerritory(t);
    }
    if (t && checkTerritory) {
      const position = await getPosition();
      const isInsidePoly = await pointInPolygon(t, position);
      setShowOutOfTerritory(!isInsidePoly);
    }
    return t;
  };

  const checkStopPointsInTerritory = async (stopPoints: any[]) => {
    let isInTerritory = true;
    await Promise.all(stopPoints.map(async (sp) => {
      const isInsidePoly = await pointInPolygon(territory, {
        coords: {
          latitude: sp.lat,
          longitude: sp.lng,
        },
      });
      if (!isInsidePoly) {
        isInTerritory = false;
        setShowOutOfTerritory(!isInsidePoly);
      }
    }));
    return isInTerritory;
  };

  useEffect(() => {
    if (showOutOfTerritory) {
      setSnapPointsState(SNAP_POINT_STATES[BS_PAGES.NOT_IN_TERRITORY]);
    }
  }, [showOutOfTerritory]);

  const initGeoService = async () => {
    await geo.initAsync();
    await loadTerritory(true);
  };

  return (
    <RideStateContext.Provider
      value={{
        territory,
        loadTerritory,
        showOutOfTerritory,
        setShowOutOfTerritory,
        initGeoService,
        isUserLocationFocused,
        setIsUserLocationFocused,
        currentBsPage,
        setCurrentBsPage,
        checkStopPointsInTerritory,
      }}
    >
      {children}
    </RideStateContext.Provider>
  );
};


export default RideStateContextProvider;
