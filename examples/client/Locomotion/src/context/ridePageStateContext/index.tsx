import React, { createContext, useState } from 'react';
import geo, { getPosition } from '../../services/geo';
import { getUserTerritories } from '../user/api';
import pointInPolygon from './pointInPolygon';

type BsPages = 'main' | 'selectLocationOnMap' | 'payment';
interface RidePageStateContextProps {
  territory: any;
  loadTerritory: () => void;
  showOutOfTerritory: boolean | undefined;
  setShowOutOfTerritory: (outOfTerritory: boolean) => void;
  initGeoService: () => void;
  selectLocationMode: boolean | undefined;
  setSelectLocationMode: (mode: boolean) => void;
  isUserLocationFocused: boolean;
  setIsUserLocationFocused: (isLocationFocused: boolean) => void;
  currentBsPage: BsPages;
  setCurrentBsPage: (page: BsPages) => void;
}

export const RideStateContextContext = createContext<RidePageStateContextProps>({
  territory: {},
  loadTerritory: () => undefined,
  setShowOutOfTerritory: (outOfTerritory: boolean) => undefined,
  initGeoService: () => undefined,
  setSelectLocationMode: (mode: boolean) => undefined,
  isUserLocationFocused: false,
  setIsUserLocationFocused: (isLocationFocused: boolean) => undefined,
  currentBsPage: 'main',
  setCurrentBsPage: (page: BsPages) => undefined,
  selectLocationMode: false,
  showOutOfTerritory: false,
});

const RideStateContextContextProvider = ({ children }: { children: any }) => {
  const [territory, setTerritory] = useState<Array<any> | null>(null);
  const [showOutOfTerritory, setShowOutOfTerritory] = useState<boolean | undefined>(false);
  const [selectLocationMode, setSelectLocationMode] = useState<boolean | undefined>(false);
  const [isUserLocationFocused, setIsUserLocationFocused] = useState(true);
  const [currentBsPage, setCurrentBsPage] = useState<BsPages>('main');

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

  const initGeoService = async () => {
    await geo.initAsync();
    await loadTerritory(true);
  };

  return (
    <RideStateContextContext.Provider
      value={{
        territory,
        loadTerritory,
        showOutOfTerritory,
        setShowOutOfTerritory,
        initGeoService,
        selectLocationMode,
        setSelectLocationMode,
        isUserLocationFocused,
        setIsUserLocationFocused,
        currentBsPage,
        setCurrentBsPage,
      }}
    >
      {children}
    </RideStateContextContext.Provider>
  );
};


export default RideStateContextContextProvider;
