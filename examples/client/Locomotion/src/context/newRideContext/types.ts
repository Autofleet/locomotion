export interface RideFeedback {
  value: string;
  type: string;
  source: string;
}

export interface RequestStopPoint {
  id: string;
  type: string;
  lat: number | null;
  lng: number | null;
  description?: string | null;
  streetAddress?: string | null;
  placeId?: string | null;
  externalId?: string | null;
  useDefaultLocation?: boolean;
  text?: string;
}

export interface SearchResult {
  text: string;
  subText?: string;
  fullText: string;
  externalId?: string;
  placeId?: string;
  description?: string;
  lat?: number;
  lng?: number;
}
