import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '@env/environment';
import { DashboardService } from './services/dashboard.service';
import { NodeDetailComponent } from './node-detail/node-detail.component';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  ecosystem: string = 'null';
  ecosystems: any = [];
  integrity: string = 'null';
  map: mapboxgl.Map;
  points: any = [];

  constructor(private dashboardService: DashboardService, private modalCtrl: ModalController) {}

  async filterChanged() {
    console.log('change', typeof this.ecosystem, this.ecosystem, this.integrity);
    try {
      this.points = await this.dashboardService.getFilteredNodes(this.ecosystem, this.integrity);
      console.log('points', this.points);
      const data = {
        type: 'FeatureCollection',
        features: this.points.map((s) => {
          const lng = s.longitud != 0 ? Number(s.longitud) : -99.1269;
          const lat = s.latitud != 0 ? Number(s.latitud) : 19.4978;
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            properties: {
              id: s.FID_sipeca,
              ecosistema: s.Ecosistema,
              integridad: s.cat_itegr,
              id_sipecam: s.id_sipe,
            },
          };
        }),
      };
      this.map.getSource('points-src').setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  async getEcosystems() {
    try {
      this.ecosystems = await this.dashboardService.getEcosystems();
    } catch (error) {
      console.log(error);
    }
  }

  async getMapInfo() {
    try {
      this.points = await this.dashboardService.getAllNodes();
    } catch (error) {
      console.log(error);
    }
  }

  initMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: environment.mapbox.style,
    });

    this.map.on('load', async () => {
      this.map.resize();
      this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-left');

      await this.getMapInfo();

      console.log('*****', this.points);

      this.map.addSource('points-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.points.map((s) => {
            const lng = s.longitud != 0 ? Number(s.longitud) : -99.1269;
            const lat = s.latitud != 0 ? Number(s.latitud) : 19.4978;
            return {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lng, lat],
              },
              properties: {
                id: s.FID_sipeca,
                ecosistema: s.Ecosistema,
                integridad: s.cat_itegr,
                id_sipecam: s.id_sipe,
              },
            };
          }),
        },
        cluster: true,
        clusterMaxZoom: 17, // Max zoom to cluster points on
        clusterRadius: 25, // Radius of each cluster when clustering points (defaults to 50)
      });

      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'points-src',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#ff8900',
          'circle-radius': 6,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });

      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'points-src',
        filter: ['has', 'point_count'],
        paint: {
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': ['step', ['get', 'point_count'], '#ff8900', 100, '#f1f075', 750, '#f28cb1'],
          'circle-radius': ['step', ['get', 'point_count'], 10, 100, 15, 750, 20],
        },
      });

      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'points-src',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 8,
        },
      });

      this.map.on('click', 'unclustered-point', (e) => {
        const id = e.features[0].properties.id_sipecam;
        console.log(e.features[0].properties);
        this.showDetail(id);
      });
    });
  }

  ngOnInit() {
    this.getEcosystems();
    this.initMap();
  }

  async showDetail(id: string) {
    const modal = await this.modalCtrl.create({
      component: NodeDetailComponent,
      componentProps: { id },
    });

    modal.present();
  }
}
