import React, { createContext, useState } from 'react';
import geo, { getPosition } from '../../services/geo';
import { getUserTerritories } from '../user/api';
import pointInPolygon from './pointInPolygon';

interface GeoContextContextInterface {
}

export const GeoContextContext = createContext<GeoContextContextInterface | null>(null);

const GeoContextContextProvider = ({ children }: { children: any }) => {
  const [territory, setTerritory] = useState(null);
  const [showTerritory, setShowTerritory] = useState<boolean | undefined>(true);

  const loadTerritory = async (checkTerritory = false) => {
    let t = territory;
    if (!t) {
      t = await getUserTerritories();
      setTerritory(t);
    }
    if (checkTerritory) {
      const position = await getPosition();
      const isInsidePoly = await pointInPolygon(t, position);
      setShowTerritory(!isInsidePoly);
    }
    return t;
  };

  const initGeoService = async () => {
    await geo.initAsync();
    await loadTerritory(true);
  };

  return (
    <GeoContextContext.Provider
      value={{
        territory,
        loadTerritory,
        showTerritory,
        setShowTerritory,
        initGeoService,
      }}
    >
      {children}
    </GeoContextContext.Provider>
  );
};


export default GeoContextContextProvider;
