import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Apollo } from 'apollo-angular';
import { getEcosystems, getOneCumulus, getOneNode } from '@api/mapa';

import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-node-detail',
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.scss'],
})
export class NodeDetailComponent implements OnInit {
  @Input() id: string;
  @Input() cumulo: string;

  map: mapboxgl.Map;
  node: any = null;
  cumulus: any = null;
  ecosystems: any = [];

  constructor(private apollo: Apollo, private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  async getEcosystems() {
    try {
      const {
        data: { ecosystems },
      }: any = await this.apollo
        .query({
          query: getEcosystems,
          variables: {
            pagination: {
              limit: 15,
              offset: 0,
            },
          },
        })
        .toPromise();
      this.ecosystems = ecosystems ?? [];
    } catch (error) {
      console.log(error);
    }
  }

  async getNodeInfo() {
    const promises = [
      this.apollo.query<any>({ query: getOneNode, variables: { id: this.id } }).toPromise(),
      this.apollo.query<any>({ query: getOneCumulus, variables: { id: this.cumulo } }).toPromise(),
    ];
    try {
      const [
        {
          data: { readOneNode },
        },
        {
          data: { readOneCumulus },
        },
      ] = await Promise.all(promises);

      this.node = readOneNode;
      this.cumulus = readOneCumulus;
      this.initMap();
    } catch (error) {
      console.log(error);
    }
  }

  getEcosystemText(id: number) {
    return this.ecosystems.find((e: any) => e.id == id)?.name ?? '';
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
        return 'Sin información';
    }
  }

  initMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'detail-map',
      style: environment.mapbox.style,
      center: this.node.location.coordinates,
      zoom: 9,
    });

    this.map.on('load', async () => {
      this.map.resize();
      this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-left');

      this.map.addSource('cumulo-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: this.cumulus.geometry,
            },
          ],
        },
      });

      this.map.addSource('point-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: this.node.location,
            },
          ],
        },
      });

      this.map.addLayer({
        id: 'cumulo',
        type: 'line',
        source: 'cumulo-src',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#ff8900',
          'line-width': 2,
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

  async ngOnInit() {
    await this.getEcosystems();
    await this.getNodeInfo();
  }
}
