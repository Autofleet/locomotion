import { point, polygon, booleanPointInPolygon } from '@turf/turf';
import Mixpanel from '../../services/Mixpanel';

const ERROR_MSG = 'unable to calc pointInPolygon';

const pointInPolygon = async (polys: any, position: any) => {
  console.debug('pointInPolygon', { position });
  if (position && polys) {
    try {
      const { coords: { latitude, longitude } } = position;
      if (latitude && longitude) {
        const t = polys.map((p: { polygon: any; }) => p.polygon.coordinates);
        const pt = point([longitude, latitude]);
        const poly = polygon(t.flat());
        return booleanPointInPolygon(pt, poly);
      }
    } catch (e) {
      console.error(ERROR_MSG, e);
      Mixpanel.trackWithProperties(ERROR_MSG, { e });
    }
  }
  return undefined;
};
export default pointInPolygon;
