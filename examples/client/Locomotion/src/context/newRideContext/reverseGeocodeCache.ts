// In-memory cache for reverse-geocode results. Same coordinate dragged twice
// (within ~1m) returns instantly instead of round-tripping the network — which
// matters most on Android, where the geocode round-trip is the dominant source
// of map-drag latency.

const TTL_MS = 5 * 60 * 1000;
const MAX_ENTRIES = 200;

type Entry = { result: any; t: number };
const cache = new Map<string, Entry>();

// Callers may pass strings (from event.latitude.toFixed(6)) or numbers.
// Coerce defensively so cache keys are consistent and we never throw.
const makeKey = (lat: number | string, lng: number | string): string => {
  const latNum = typeof lat === 'number' ? lat : parseFloat(lat);
  const lngNum = typeof lng === 'number' ? lng : parseFloat(lng);
  return `${latNum.toFixed(5)},${lngNum.toFixed(5)}`;
};

export const getCached = (lat: number | string, lng: number | string): any | undefined => {
  const entry = cache.get(makeKey(lat, lng));
  if (!entry) return undefined;
  if (Date.now() - entry.t > TTL_MS) {
    cache.delete(makeKey(lat, lng));
    return undefined;
  }
  return entry.result;
};

export const setCached = (lat: number | string, lng: number | string, result: any): void => {
  if (!result) return;
  if (cache.size >= MAX_ENTRIES) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(makeKey(lat, lng), { result, t: Date.now() });
};
