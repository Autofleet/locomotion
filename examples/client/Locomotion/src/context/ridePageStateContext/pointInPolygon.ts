import { point, polygon, booleanPointInPolygon } from '@turf/turf';
import Mixpanel from '../../services/Mixpanel';

const ERROR_MSG = 'unable to calc pointInPolygon';

const pointInPolygon = (polys: any, position: any) => {
  console.debug('pointInPolygon', { position });
  if (position && polys) {
    try {
      const { coords: { latitude, longitude } } = position;
      if (latitude && longitude) {
        const territoryPolygons = polys.map((p: { polygon: any; }) => polygon(p.polygon.coordinates));
        const pt = point([longitude, latitude]);
        return territoryPolygons.some((poly: any) => booleanPointInPolygon(pt, poly));
      }
    } catch (e) {
      console.error(ERROR_MSG, e);
      Mixpanel.trackWithProperties(ERROR_MSG, { e });
    }
  }
  return undefined;
};
export default pointInPolygon;
