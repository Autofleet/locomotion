import CheapRuler, { Point } from 'cheap-ruler';

export const getSubLineStringAfterLocationFromDecodedPolyline = (pointsFromPolyline: Point[], location: {latitude: number; longitude: number}) => {
  console.log(pointsFromPolyline);
  const ruler = new CheapRuler(location.latitude, 'meters');
  console.log(1);
  const origin: Point = [location.latitude, location.longitude];
  console.log(2);

  const pointOnLine = ruler.pointOnLine(pointsFromPolyline, origin).point;
  console.log(3);

  if (pointOnLine[0] === 0.0 && pointOnLine[1] === 0.0) {
    return pointsFromPolyline;
  }
  console.log(4);

  return ruler.lineSlice(
    pointOnLine,
    pointsFromPolyline[pointsFromPolyline.length - 1],
    pointsFromPolyline,
  );
};
