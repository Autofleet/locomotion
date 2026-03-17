declare module '@turf/turf' {
  export function point(coordinates: number[]): GeoJSON.Feature<GeoJSON.Point>;
  export function distance(from: GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[], to: GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[], options?: { units?: string }): number;
  export function booleanPointInPolygon(point: GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[], polygon: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>): boolean;
  export function polygon(coordinates: number[][][]): GeoJSON.Feature<GeoJSON.Polygon>;
  export function lineString(coordinates: number[][]): GeoJSON.Feature<GeoJSON.LineString>;
  export function length(geojson: GeoJSON.Feature<GeoJSON.LineString>, options?: { units?: string }): number;
  export function along(line: GeoJSON.Feature<GeoJSON.LineString>, distance: number, options?: { units?: string }): GeoJSON.Feature<GeoJSON.Point>;
  export function bearing(start: GeoJSON.Feature<GeoJSON.Point> | number[], end: GeoJSON.Feature<GeoJSON.Point> | number[]): number;
  export function nearestPointOnLine(line: GeoJSON.Feature<GeoJSON.LineString>, pt: GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[]): GeoJSON.Feature<GeoJSON.Point>;
  export function lineSplit(line: GeoJSON.Feature<GeoJSON.LineString>, splitter: GeoJSON.Feature<GeoJSON.Point>): GeoJSON.FeatureCollection<GeoJSON.LineString>;
}
