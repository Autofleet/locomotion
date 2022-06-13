import { point, polygon, booleanPointInPolygon } from '@turf/turf';
import Mixpanel from '../../services/Mixpanel';

export default async (polys: any, position: any) => {
  if (position) {
    try {
      const { coords: { latitude, longitude } } = position;
      const t = polys.map((p: { polygon: any; }) => p.polygon.coordinates);
      const pt = point([longitude, latitude]);
      const poly = polygon(t.flat());
      return booleanPointInPolygon(pt, poly);
    } catch (e) {
      console.error(e);
      Mixpanel.trackWithProperties('unable to calc pointInPolygon', { e });
    }
  }
};
