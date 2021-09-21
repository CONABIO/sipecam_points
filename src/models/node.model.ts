import { PointGeometry } from './point-geometry.model';

export interface Node {
  id: string;
  nomenclatura: string;
  con_socio?: number;
  fid?: number;
  location: PointGeometry;
  cat_integr?: string;
  cumulus_id: number;
  ecosystem_id: number;
  created_at?: string;
}
