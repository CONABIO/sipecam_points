import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../home/services/dashboard.service';

import { environment } from '@env/environment';

@Component({
  selector: 'app-cumulos',
  templateUrl: './cumulos.component.html',
  styleUrls: ['./cumulos.component.scss'],
})
export class CumulosComponent implements OnInit {
  nodes: any = [];

  constructor(private dashboardService: DashboardService) {}

  async getNodes() {
    try {
      this.nodes = await this.dashboardService.allNodesGraphql();
    } catch (error) {
      console.log(error);
    }
  }
  ngOnInit() {
    this.getNodes();
  }
}
