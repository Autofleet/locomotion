import React, { createContext, useState } from 'react';
import geo, { getPosition } from '../../services/geo';
import { getUserTerritories } from '../user/api';
import pointInPolygon from './pointInPolygon';

export const RideStateContextContext = createContext<any | null>(null);

const RideStateContextContextProvider = ({ children }: { children: any }) => {
  const [territory, setTerritory] = useState<Array<any> | null>(null);
  const [showOutOfTerritory, setShowOutOfTerritory] = useState<boolean | undefined>(false);
  const [selectLocationMode, setSelectLocationMode] = useState<boolean | undefined>(false);
  const [lastSelectedLocation, saveSelectedLocation] = useState<any | undefined>(false);
  const [isUserLocationFocused, setIsUserLocationFocused] = useState(true);

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
        lastSelectedLocation,
        saveSelectedLocation,
        isUserLocationFocused,
        setIsUserLocationFocused,
      }}
    >
      {children}
    </RideStateContextContext.Provider>
  );
};


export default RideStateContextContextProvider;
