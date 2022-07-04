import CheapRuler, { Point } from 'cheap-ruler';

export const getSubLineStringAfterLocationFromDecodedPolyline = (pointsFromPolyline: Point[], location: {latitude: number; longitude: number}) => {
  const ruler = new CheapRuler(location.latitude, 'meters');
  const origin: Point = [location.latitude, location.longitude];

  const pointOnLine = ruler.pointOnLine(pointsFromPolyline, origin).point;
  if (pointOnLine[0] === 0.0 && pointOnLine[1] === 0.0) {
    return pointsFromPolyline;
  }
  return ruler.lineSlice(
    pointOnLine,
    pointsFromPolyline[pointsFromPolyline.length - 1],
    pointsFromPolyline,
  );
};
