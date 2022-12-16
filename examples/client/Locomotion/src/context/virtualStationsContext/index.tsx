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
import Config from 'react-native-config';
import { point, distance } from '@turf/turf';
import { UserContext } from '../user';
import OneSignal from '../../services/one-signal';
import {
  getStations as getStationsCall,
} from './api';
import * as navigationService from '../../services/navigation';
import { MAIN_ROUTES, APP_ROUTES } from '../../pages/routes';
import i18n from '../../I18n';
import SettingContext from '../settings';
import { getPosition, DEFAULT_COORDS } from '../../services/geo';
import VirtualStationMarker from '../../Components/VirtualStationMarker';

type Location = {
  lat: number;
  lng: number;
}

type Coords = {
  latitude: number;
  longitude: number;
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
  isStationsEnabled: boolean;
  rawStations: Station[];
  stationsList: Station[];
}

export const VirtualStationsContext = createContext<VirtualStationsContextInterface>({
  loadVirtualStations: async () => undefined,
  getMapMarkers: () => undefined,
  isStationsEnabled: false,
  rawStations: [],
  stationsList: [],
});
/* {

}; */
const StationsProvider = ({ children }: { children: any }) => {
  const { user } = useContext(UserContext);
  const [isStationsEnabled, setIsStationsEnabled] = useState(false);
  const [rawStations, setRawStations] = useState<Station[]>([]);
  const [stationsList, setStationsList] = useState<Station[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location>({
    lat: DEFAULT_COORDS.coords.latitude,
    lng: DEFAULT_COORDS.coords.longitude,
  });
  const [isLoading, setIsLoading] = useState(false);

  const init = async () => {
    getCurrentLocation();
    loadVirtualStations();
  };

  const loadVirtualStations = async () => {
    try {
      const stations = await getStationsCall();
      setRawStations(stations);
    } catch (e) {
      console.log(e);
    }
  };

  const getCurrentLocation = async () => {
    const location = await getPosition();
    if (!location) {
      setCurrentLocation(formatCoords(DEFAULT_COORDS.coords));
      return DEFAULT_COORDS.coords;
    }
    setCurrentLocation(formatCoords(location.coords));
    return location.coords;
  };

  const formatCoords = (coords:Coords) => ({ lat: coords.latitude, lng: coords.longitude });

  const sortAndUpdateStations = useCallback((location = null) => {
    const sortedStations = sortStationsByDistanceUsingTurf(location || currentLocation);
    setStationsList(sortedStations);
  }, [rawStations, currentLocation]);

  const calculateDistance = (sourceLocation: Location, destinationLocation:Location) => {
    const sourcePoint = point([sourceLocation.lng, sourceLocation.lat]);
    const destinationPoint = point([destinationLocation.lng, destinationLocation.lat]);
    const pointsDistance = distance(sourcePoint, destinationPoint, { units: 'meters' });
    return pointsDistance;
  };

  const sortStationsByDistanceUsingTurf = (
    sourceLocation: Location,
  ) => {
    const sortedStations = rawStations.sort((a, b) => {
      const aDistance = calculateDistance({ lng: a.coordinates.lng, lat: a.coordinates.lat }, sourceLocation);
      const bDistance = calculateDistance({ lng: b.coordinates.lng, lat: b.coordinates.lat }, sourceLocation);
      return aDistance - bDistance;
    });

    return sortedStations;
  };

  const sortStationsByDistance = (stations) => {
    const sortedStations = stations.sort((a, b) => a.distance - b.distance);
    return sortedStations;
  };

  const addDistanceToStations = (stations:Station[], location:Location) => {
    const stationsWithDistance = stations.map((station) => {
      const stationDistance = calculateDistance({ lng: station.coordinates.lng, lat: station.coordinates.lat }, location);
      return { ...station, distance: stationDistance };
    });
    return stationsWithDistance;
  };

  const getStationList = (sourceLocation: Location | null = null) => {
    const location = sourceLocation || currentLocation;
    const stationsWithDistance = addDistanceToStations(rawStations, location);
    const sortedStations = sortStationsByDistance(stationsWithDistance);
    setStationsList(sortedStations);
    return sortedStations;
  };


  useEffect(() => {
    if (rawStations?.length) {
      sortAndUpdateStations();
      setIsStationsEnabled(true);
    }
  }, [rawStations]);

  useEffect(() => {
    if (user && user.id) {
      init();
    }
  }, [user?.id]);


  const createMapMarker = (station:Station) => (
    <VirtualStationMarker station={station} onCalloutPress={(selectedStation:Station) => console.log('selectedStation', selectedStation)} />
  );


  const getMapMarkers = () => useCallback(rawStations.map(s =>
  // console.log(s);
    createMapMarker(s)), [rawStations]);

  return (
    <VirtualStationsContext.Provider
      value={{
        loadVirtualStations,
        getMapMarkers,
        isStationsEnabled,
        rawStations,
        stationsList,
        sortAndUpdateStations,
        sortStationsByDistanceUsingTurf,
        getStationList,
      }}
    >
      {children}
    </VirtualStationsContext.Provider>
  );
};

export default StationsProvider;
