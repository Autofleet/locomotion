import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import type { MapMarker } from 'react-native-maps';
import { point, distance } from '@turf/turf';
import { UserContext } from '../user';
import {
  getStations as getStationsCall,
} from './api';
import { getPosition, DEFAULT_COORDS } from '../../services/geo';
import {
  STOP_POINT_TYPES,
} from '../../lib/commonTypes';
import VirtualStationMarker from '../../Components/VirtualStationMarker';
import type { RequestStopPoint } from '../newRideContext/types';

export type Location = {
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
    externalId: string;
    coordinates: Location;
    distance?: number,
}

interface VirtualStationsContextInterface {
  loadVirtualStations: () => Promise<void>;
  isStationsEnabled: boolean;
  rawStations: Station[];
  stationsList: Station[];
  StationMarkers: React.FC<{ requestedStopPoints: RequestStopPoint[] }>;
  sortAndUpdateStations: (location?: Location | null) => void
  getStationList: (sourceLocation?: Location | null) => Station[]
  sortStationsByDistanceUsingTurf?: (sourceLocation: Location) => Station[];
  stationCalloutsRef: React.MutableRefObject<Record<string, MapMarker | null>>;
}

export const VirtualStationsContext = createContext<VirtualStationsContextInterface>({
  loadVirtualStations: async () => undefined,
  isStationsEnabled: false,
  rawStations: [],
  stationsList: [],
  StationMarkers: () => null,
  sortAndUpdateStations: () => undefined,
  getStationList: () => [],
  stationCalloutsRef: { current: {} },
});

const StationsProvider = ({ children }: { children: any }) => {
  const { user, locationGranted } = useContext(UserContext);
  const [isStationsEnabled, setIsStationsEnabled] = useState(false);
  const [rawStations, setRawStations] = useState<Station[]>([]);
  const [stationsList, setStationsList] = useState<Station[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location>({
    lat: DEFAULT_COORDS.coords.latitude,
    lng: DEFAULT_COORDS.coords.longitude,
  });
  const [isLoading, setIsLoading] = useState(false);
  const stationCalloutsRef = useRef<Record<string, MapMarker | null>>({});

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


  useEffect(() => {
    getCurrentLocation();
  }, [locationGranted]);

  const formatCoords = (coords:Coords) => ({ lat: coords.latitude, lng: coords.longitude });

  const sortAndUpdateStations = useCallback((location: Location | null = null) => {
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

  const sortStationsByDistance = (stations:(Station & { distance: number })[]) => {
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
  }, [rawStations?.length]);

  useEffect(() => {
    if (user && user.id) {
      init();
    }
  }, [user?.id]);


  const createMapMarker = (station:Station, stopPoints: RequestStopPoint[]) => {
    let type = 'default';

    if (station?.externalId === stopPoints[0]?.externalId) {
      type = STOP_POINT_TYPES.STOP_POINT_PICKUP;
    }

    if (station?.externalId === stopPoints[1]?.externalId) {
      type = STOP_POINT_TYPES.STOP_POINT_DROPOFF;
    }


    return (
      <VirtualStationMarker
        station={station}
        type={type}
        onCalloutPress={(selectedStation:Station) => console.log('selectedStation', selectedStation)}
        ref={(r) => {
          stationCalloutsRef.current[station.externalId] = r;
        }}
      />
    );
  };

  const StationMarkers = ({ requestedStopPoints }: { requestedStopPoints: RequestStopPoint[] }) => (
    useMemo(
      () => rawStations.map((s) => createMapMarker(s, requestedStopPoints)),
      [rawStations, requestedStopPoints],
    )
  );

  return (
    <VirtualStationsContext.Provider
      value={{
        loadVirtualStations,
        StationMarkers,
        isStationsEnabled,
        rawStations,
        stationsList,
        sortAndUpdateStations,
        getStationList,
        stationCalloutsRef,
      }}
    >
      {children}
    </VirtualStationsContext.Provider>
  );
};

export default StationsProvider;
