import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '@env/environment';
import { DashboardService } from '../../services/dashboard.service';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-node-detail',
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.scss'],
})
export class NodeDetailComponent implements OnInit {
  @Input() id: string;

  map: mapboxgl.Map;
  node: any = null;

  constructor(private dashboardService: DashboardService, private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  async getNodeInfo() {
    try {
      this.node = (await this.dashboardService.getNode(this.id))[0];
      console.log(this.node);
      this.initMap();
    } catch (error) {
      console.log(error);
    }
  }

  getSocioText(value: number) {
    switch (value) {
      case 0:
        return 'Sin socio';
      case 1:
        return 'Con socio potencial';
      case 2:
        return 'Con socio';
      default:
        return '';
    }
  }

  initMap() {
    const lng = this.node.longitud != 0 ? Number(this.node.longitud) : 0;
    const lat = this.node.latitud != 0 ? Number(this.node.latitud) : 0;

    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'detail-map',
      style: environment.mapbox.style,
      center: [lng, lat],
      zoom: 12,
    });

    this.map.on('load', async () => {
      this.map.resize();
      this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-left');

      this.map.addSource('point-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lng, lat],
              },
            },
          ],
        },
      });

      this.map.addLayer({
        id: 'point',
        type: 'circle',
        source: 'point-src',
        paint: {
          'circle-color': '#ff8900',
          'circle-radius': 6,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });
    });
  }

  ngOnInit() {
    this.getNodeInfo();
  }
}
