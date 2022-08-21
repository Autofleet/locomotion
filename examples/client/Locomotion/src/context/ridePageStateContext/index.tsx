import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { BottomSheetContext, SNAP_POINT_STATES } from '../bottomSheetContext';
import geo, { DEFAULT_COORDS, getPosition } from '../../services/geo';
import { getUserTerritories } from '../user/api';
import pointInPolygon from './pointInPolygon';
import { BsPages, BS_PAGES } from './utils';
import GenericErrorPopup from '../../popups/GenericError';
import Mixpanel from '../../services/Mixpanel';

interface RidePageStateContextProps {
  territory: any;
  loadTerritory: () => void;
  initGeoService: (skipTerritoryCheck?: boolean) => Promise<void>;
  isUserLocationFocused: boolean;
  setIsUserLocationFocused: (isLocationFocused: boolean) => void;
  currentBsPage: BsPages;
  checkStopPointsInTerritory: (sp: any) => boolean;
  changeBsPage: (pageName: BsPages) => void;
  setGenericErrorPopup: (error: any) => void;
  closestTerritory: any | null;
}

export const RideStateContextContext = createContext<RidePageStateContextProps>({
  territory: {},
  loadTerritory: () => undefined,
  initGeoService: async () => undefined,
  isUserLocationFocused: false,
  setIsUserLocationFocused: (isLocationFocused: boolean) => undefined,
  currentBsPage: BS_PAGES.ADDRESS_SELECTOR,
  checkStopPointsInTerritory: () => false,
  changeBsPage: () => undefined,
  setGenericErrorPopup: () => undefined,
  closestTerritory: null,
});

const RideStateContextContextProvider = ({ children }: { children: any }) => {
  const [genericErrorPopup, setGenericErrorPopup] = useState<any | null>(null);
  const [territory, setTerritory] = useState<Array<any> | null>(null);
  const [isUserLocationFocused, setIsUserLocationFocused] = useState(false);
  const [currentBsPage, setCurrentBsPage] = useState<BsPages>(BS_PAGES.LOADING);
  const [closestTerritory, setClosestTerritory] = useState<any | null>(null);
  const { setSnapPointsState, setIsExpanded } = useContext(BottomSheetContext);

  const changeBsPage = (pageName: BsPages) => {
    Mixpanel.pageView(`Bottom sheet - ${pageName}`);
    setIsExpanded(false);
    setSnapPointsState(SNAP_POINT_STATES[pageName]);
    setCurrentBsPage(pageName);
  };
  const setNotInTerritory = () => {
    changeBsPage(BS_PAGES.NOT_IN_TERRITORY);
  };
  const loadTerritory = async (checkTerritory = false) => {
    let t = territory;
    const position = await getPosition();
    if (!t) {
      const { territories, closest } = await getUserTerritories((position || DEFAULT_COORDS).coords);
      t = territories && territories.flat();
      setTerritory(t);
      if (closest) {
        setClosestTerritory(closest);
      }
    }
    if (t && checkTerritory) {
      const isInsidePoly = pointInPolygon(t, (position || DEFAULT_COORDS));
      if (!isInsidePoly) {
        setNotInTerritory();
      }
    }
    return t;
  };

  const checkStopPointsInTerritory = (stopPoints: any[]) => {
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

  const initGeoService = async (checkTerritory?: boolean) => {
    await geo.initAsync();
    await loadTerritory(checkTerritory);
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
        setGenericErrorPopup,
        closestTerritory,
      }}
    >
      {children}
      <GenericErrorPopup
        isVisible={!!genericErrorPopup}
        closePopup={() => {
          setGenericErrorPopup(null);
        }}
      />
    </RideStateContextContext.Provider>
  );
};


export default RideStateContextContextProvider;
