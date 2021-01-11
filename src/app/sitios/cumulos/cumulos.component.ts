import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

import { DashboardService } from '../../services/dashboard.service';

import { Apollo } from 'apollo-angular';
import * as turf from '@turf/turf';
import * as _ from 'lodash';

@Component({
  selector: 'app-cumulos',
  templateUrl: './cumulos.component.html',
  styleUrls: ['./cumulos.component.scss'],
})
export class CumulosComponent implements OnInit {
  loading: HTMLIonLoadingElement;
  nodes: any = [];
  currentNodes: Array<any> = [];
  cumulos: any = [];

  constructor(
    private apollo: Apollo,
    private dashboardService: DashboardService,
    private loadingCtrl: LoadingController
  ) {}

  async getNodes() {
    try {
      this.nodes = await this.dashboardService.getAllNodes();
    } catch (error) {}
  }

  getSocioValue(nodes: any) {
    for (const node of nodes) {
      if (node.con_socio === 2) {
        return 2;
      }
      if (node.con_socio === 1) {
        return 1;
      }
    }
    return 0;
  }

  async ngOnInit() {
    await this.getNodes();
    this.processCumulos();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ backdropDismiss: false });
    return await this.loading.present();
  }

  processCumulos() {
    const nodesByCum = _.groupBy(this.nodes, 'id_cumulo');
    this.cumulos = Object.keys(nodesByCum).map((cumulo) => {
      const featureCollection = turf.featureCollection(
        nodesByCum[cumulo].map((s) => {
          const lng = s.longitud != 0 ? Number(s.longitud) : -99.1269;
          const lat = s.latitud != 0 ? Number(s.latitud) : 19.4978;
          return turf.point([lng, lat], {
            id: s.FID_sipeca,
            ecosistema: s.Ecosistema,
            integridad: s.cat_itegr,
            id_sipecam: s.id_sipe,
          });
        })
      );
      const hull = turf.convex(featureCollection);
      hull.properties = {
        cumulo,
        nodos: nodesByCum[cumulo].length,
        socio: this.getSocioValue(nodesByCum[cumulo]),
      };
      return hull;
    });
  }
}
