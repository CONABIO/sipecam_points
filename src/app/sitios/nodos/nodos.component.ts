import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

import { DashboardService } from '../../services/dashboard.service';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-nodos',
  templateUrl: './nodos.component.html',
  styleUrls: ['./nodos.component.scss'],
})
export class NodosComponent implements OnInit {
  loading: HTMLIonLoadingElement;
  nodes: Array<any> = [];
  currentNodes: Array<any> = [];

  constructor(
    private apollo: Apollo,
    private dashboardService: DashboardService,
    private loadingCtrl: LoadingController
  ) {}

  async getNodes() {
    try {
      this.nodes = await this.dashboardService.allNodes();
    } catch (error) {}
  }

  ngOnInit() {}

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ backdropDismiss: false });
    return await this.loading.present();
  }
}
