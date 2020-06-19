import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { FiltersService } from '../services/filters.service';

export interface MapContext {
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

  constructor(private dashboardService: DashboardService) {}

  filterChanged(param: string, event: any) {
    console.log(param, event.target.value);
    this.fs.setParam(param, event.target.value);
  }

  resetFilters() {
    this.fs.resetParams();
    this.filters = this.fs.filters;
  }

  async getEcosystems() {
    try {
      this.ecosystems = await this.dashboardService.getEcosystems();
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
