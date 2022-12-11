import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Platform, Text, View } from 'react-native';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import {
  Marker, MarkerAnimated, AnimatedRegion, Callout,
} from 'react-native-maps';
import Config from 'react-native-config';
import { UserContext } from '../user';
import OneSignal from '../../services/one-signal';
import {
  getStations as getStationsCall,
} from './api';
import * as navigationService from '../../services/navigation';
import { MAIN_ROUTES, APP_ROUTES } from '../../pages/routes';
import i18n from '../../I18n';
import { RidePageContext } from '../newRideContext';
import SettingContext from '../settings';
import VirtualStationMarker from '../../Components/VirtualStationMarker';

type Location = {
  lat: number;
  lng: number;
}

export type Station = {
    id: string;
    label: string;
    address?: string;
    externalId?: string;
    coordinates: Location;
    distance?: number,
}

interface VirtualStationsContextInterface {
  loadVirtualStations: () => Promise<void>;
  getMapMarkers: () => any;

}

export const VirtualStationsContext = createContext<VirtualStationsContextInterface>({
  loadVirtualStations: async () => undefined,
  getMapMarkers: () => undefined,
});

const StationsProvider = ({ children }: { children: any }) => {
  const { user } = useContext(UserContext);
  const { getSettingByKey } = SettingContext.useContainer();
  const { getRidesByParams } = useContext(RidePageContext);
  const [isStationsEnabled, setIsStationsEnabled] = useState(false);
  const [stationsUrl, setStationsUrl] = useState<string | null>(null);

  const [rawStations, setRawStations] = useState<Station[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const init = async () => {
    const stations = await getStationsCall();
    setRawStations(stations);
  };

  const loadVirtualStations = async () => {
    // setRawStations(stationsUrl);
  };

  useEffect(() => {
    if (stationsUrl) {
      setIsStationsEnabled(true);
      loadVirtualStations();
    }
  }, [stationsUrl]);

  useEffect(() => {
    if (user && user.id) {
      init();
    }
  }, [user?.id]);


  const createMapMarker = (station:Station) => (
    <VirtualStationMarker station={station} onCalloutPress={(selectedStation:Station) => console.log('selectedStation', selectedStation)} />
  );

  const getMapMarkers = () => useCallback([{
    id: '4',
    label: 'Station name',
    address: '136 Madison Avenue, NY',
    distance: 500,
    coordinates: {
      lat: 32.06837319164164,
      lng: 34.789900166993874,
    },

  }].map((s) => {
    console.log(s);
    return createMapMarker(s);
  }), [rawStations]);

  return (
    <VirtualStationsContext.Provider
      value={{
        loadVirtualStations,
        getMapMarkers,
      }}
    >
      {children}
    </VirtualStationsContext.Provider>
  );
};

export default StationsProvider;
