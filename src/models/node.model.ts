import { PointGeometry } from './point-geometry.model';

export interface Node {
  id: string;
  nomenclatura: string;
  has_partner?: boolean;
  fid?: number;
  location: PointGeometry;
  cat_integr?: string;
  integrity: boolean;
  cumulus_id: number;
  ecosystem_id: number;
  created_at?: string;
}
