import { PolygonGeometry } from './polygon-geometry.model';

export interface Cumulus {
  id: string;
  name: string;
  geometry: PolygonGeometry;
  criteria_id: number;
  user_ids: number[];
  created_at: string;
}
