// eslint-disable-next-line import/no-extraneous-dependencies
import { point, polygon, booleanPointInPolygon } from '@turf/turf';
import Mixpanel from '../../services/Mixpanel';

const ERROR_MSG = 'unable to calc pointInPolygon';

export default async (polys: any, position: any) => {
  if (position) {
    try {
      const { coords: { latitude, longitude } } = position;
      const t = polys.map((p: { polygon: any; }) => p.polygon.coordinates);
      const pt = point([longitude, latitude]);
      const poly = polygon(t.flat());
      return booleanPointInPolygon(pt, poly);
    } catch (e) {
      console.error(ERROR_MSG, e);
      Mixpanel.trackWithProperties(ERROR_MSG, { e });
      return true;
    }
  }
};
