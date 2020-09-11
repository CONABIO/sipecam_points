import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MapContext {
  anp: boolean;
  ecosystem: string | null;
  integrity: string | null;
  layer: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private _filters = new BehaviorSubject<MapContext>({
    anp: true,
    ecosystem: null,
    integrity: null,
    layer: null,
  });

  filtersObservable = this._filters.asObservable();

  constructor() {}

  get filters() {
    return this._filters.getValue();
  }

  resetParams() {
    this._filters.next({
      anp: true,
      ecosystem: null,
      integrity: null,
      layer: null,
    });
  }

  setParam(param: string, value: any) {
    this._filters.next({
      ...this._filters.getValue(),
      [param]: value,
    });
  }
}
