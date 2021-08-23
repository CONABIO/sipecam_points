import { Component, Input, OnInit } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { getEcosystems } from '@api/mapa';

import { FiltersService } from '../../services/filters.service';

export interface MapContext {
  anp: boolean;
  cumulos: boolean;
  ecosystem: string | null;
  integrity: string | null;
  layer: string | null;
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  ecosystems: any = [];
  @Input() filters: MapContext;
  @Input() fs: FiltersService;

  constructor(private apollo: Apollo) {}

  filterChanged(param: string, event: any) {
    this.fs.setParam(param, event.target.value || null);
  }

  resetFilters() {
    this.fs.resetParams();
    this.filters = this.fs.filters;
  }

  async getEcosystems() {
    try {
      const { data }: any = await this.apollo
        .query({
          query: getEcosystems,
          variables: {
            pagination: {
              limit: 50,
              offset: 0,
            },
          },
        })
        .toPromise();
      this.ecosystems = data?.ecosystems ?? [];
      this.filters = this.fs.filters;
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    // this.filters = this.filtersService.filters;
    this.getEcosystems();
  }
}
