import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import { point, distance } from '@turf/turf';
import { UserContext } from '../user';
import {
  getStations as getStationsCall,
} from './api';
import { getPosition, DEFAULT_COORDS } from '../../services/geo';
import {
  STOP_POINT_TYPES,
} from '../../lib/commonTypes';
import { StopPoint } from '../newRideContext/utils';
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
    externalId: string;
    coordinates: Location;
    distance?: number,
}

interface VirtualStationsContextInterface {
  loadVirtualStations: () => Promise<void>;
  getMapMarkers: (stopPoints: StopPoint[]) => React.ReactNode[];
  isStationsEnabled: boolean;
  rawStations: Station[];
  stationsList: Station[];
  StationMarkers: React.FC<{ requestedStopPoints: StopPoint[] }>;
  sortAndUpdateStations: () => void
  getStationList: (sourceLocation?: { lat: number; lng: number } | null) => Station[]
  stationCalloutsRef: React.MutableRefObject<Record<string, unknown>>;
}

export const VirtualStationsContext = createContext<VirtualStationsContextInterface>({
  loadVirtualStations: async () => undefined,
  getMapMarkers: () => [],
  isStationsEnabled: false,
  rawStations: [],
  stationsList: [],
  StationMarkers: () => null,
  sortAndUpdateStations: () => undefined,
  getStationList: () => [],
  stationCalloutsRef: { current: {} },
});

const StationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, locationGranted } = useContext(UserContext);
  const [isStationsEnabled, setIsStationsEnabled] = useState(false);
  const [rawStations, setRawStations] = useState<Station[]>([]);
  const [stationsList, setStationsList] = useState<Station[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location>({
    lat: DEFAULT_COORDS.coords.latitude,
    lng: DEFAULT_COORDS.coords.longitude,
  });
  const [isLoading, setIsLoading] = useState(false);
  const stationCalloutsRef = useRef<Record<string, unknown>>({});

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

  const sortStationsByDistance = (stations:Station[]) => {
    const sortedStations = stations.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
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


  const createMapMarker = (station: Station, stopPoints: StopPoint[]) => {
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
        onCalloutPress={(selectedStation: Station) => console.log('selectedStation', selectedStation)}
        ref={(r: unknown) => {
          stationCalloutsRef.current[station.externalId] = r;
        }}
      />
    );
  };

  const getMapMarkers = (stopPoints: StopPoint[]): React.ReactNode[] => rawStations.map(s => createMapMarker(s, stopPoints));

  const StationMarkers = ({ requestedStopPoints }: { requestedStopPoints: StopPoint[] }) => {
    const markers = useCallback(() => rawStations.map(s => createMapMarker(s, requestedStopPoints)), [requestedStopPoints]);
    return <>{markers()}</>;
  };

  return (
    <VirtualStationsContext.Provider
      value={{
        loadVirtualStations,
        getMapMarkers,
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
