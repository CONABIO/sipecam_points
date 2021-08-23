import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { getCumulus, getNodes } from '@api/mapa';
import { environment } from '@env/environment';
import { DashboardService } from '../services/dashboard.service';
import { FiltersService } from '../services/filters.service';
import { NodeDetailComponent } from './node-detail/node-detail.component';
import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import * as _ from 'lodash';

export interface MapContext {
  anp: boolean;
  cumulos: boolean;
  ecosystem: string | null;
  integrity: string | null;
  layer: string | null;
}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {
  ecosystem: string = 'null';
  integrity: string = 'null';
  map: mapboxgl.Map;
  cumulos: any = [];
  nodos: any = [];

  filters: MapContext = {
    anp: true,
    cumulos: true,
    ecosystem: null,
    integrity: null,
    layer: null,
  };

  layers = {
    integridad_ecosistemica:
      'https://monitoreo.conabio.gob.mx/geoserver/geoportal/wms?service=WMS&version=1.1.0&request=GetMap&layers=geoportal:mex_ie_2014_250m&styles=&bbox={bbox-epsg-3857}&width=768&height=436&srs=EPSG:3857&format=image%2Fpng&transparent=true',
    vegetacion:
      'https://monitoreo.conabio.gob.mx/geoserver/geoportal/wms?service=WMS&version=1.1.0&request=GetMap&layers=geoportal:mex_RE_2015_8_clases&styles=&bbox={bbox-epsg-3857}&width=768&height=456&srs=EPSG:3857&format=image%2Fpng&transparent=true',
    perdida_vegetacion:
      'https://monitoreo.conabio.gob.mx/geoserver/geoportal_deprecated/wms?service=WMS&version=1.1.0&request=GetMap&layers=geoportal_deprecated:mex_LSperdida_2001_2017&styles=&bbox={bbox-epsg-3857}&width=768&height=576&srs=EPSG:3857&format=image%2Fpng&transparent=true',
  };

  showFilterBar = true;

  constructor(
    private alertController: AlertController,
    private apollo: Apollo,
    private dashboardService: DashboardService,
    public filtersService: FiltersService,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  createMapLayers() {
    Object.keys(this.layers).forEach((layer) => {
      this.map.addSource(`${layer}-src`, {
        type: 'raster',
        tiles: [this.layers[layer]],
        tileSize: 128,
      });
      this.map.addLayer(
        {
          id: `${layer}`,
          type: 'raster',
          source: `${layer}-src`,
          layout: {
            visibility: 'none',
          },
          paint: {
            'raster-opacity': 1,
          },
        },
        'anps'
      );
    });
  }

  async filterChanged(filters: MapContext) {
    console.log('change', typeof filters.ecosystem, filters);
    try {
      this.nodos = await this.dashboardService.getFilteredNodes(filters.ecosystem, filters.integrity);

      const data = {
        type: 'FeatureCollection',
        features: this.nodos.map((s) => {
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
      this.map.getSource('nodos-src').setData(data);
      this.updateCentroids();
    } catch (error) {
      console.log(error);
    }
  }

  async getCumulos() {
    try {
      const { data }: any = await this.apollo
        .query({
          query: getCumulus,
          variables: {
            pagination: {
              limit: 500,
              offset: 0,
            },
          },
        })
        .toPromise();

      this.cumulos = data?.cumulus ?? [];
    } catch (error) {
      console.log(error);
    }
  }

  async getNodos() {
    try {
      const { data }: any = await this.apollo
        .query({
          query: getNodes,
          variables: {
            pagination: {
              limit: 5000,
              offset: 0,
            },
          },
        })
        .toPromise();

      this.nodos = data?.nodes ?? [];
    } catch (error) {
      console.log(error);
    }
  }

  getSocioValue(nodes: any) {
    for (const node of nodes) {
      if (node.has_partner) {
        return true;
      }
    }
    return false;
  }

  async goToCalendar(id: string = null, name?: string) {
    const alert = await this.alertController.create({
      header: 'Calendario',
      message: `¿Deseas ir al calendario del cúmulo ${name}?`,
      buttons: [
        'Cancelar',
        {
          text: 'Ir',
          handler: () => {
            this.router.navigate(['/eventos', id]);
          },
        },
      ],
    });

    await alert.present();
  }

  initMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: environment.mapbox.style,
      minZoom: 5,
    });

    this.map.on('load', async () => {
      this.map.resize();
      this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-left');
      this.createMapLayers();

      await this.getNodos();

      this.setCumulosLayers();
      this.setNodosLayers();
    });
  }

  ngOnInit() {
    this.initMap();

    this.filtersService.filtersObservable.subscribe((filters) => {
      if (this.filters.layer) {
        this.map.setLayoutProperty(this.filters.layer, 'visibility', 'none');
      }
      if (filters.layer) {
        this.map.setLayoutProperty(filters.layer, 'visibility', 'visible');
      }

      if (this.filters.ecosystem !== filters.ecosystem || this.filters.integrity !== filters.integrity) {
        this.filterChanged(filters);
      }

      if (this.filters.anp !== filters.anp) {
        this.showANPLayer(filters.anp);
      }

      if (this.filters.cumulos !== filters.cumulos) {
        this.showCumulosLayer(filters.cumulos);
      }

      this.filters = { ...filters };
    });
  }

  setCumulosLayers() {
    const nodesByCum = _.groupBy(this.nodos, 'cumulus_id');
    const polygons = Object.keys(nodesByCum).map((cumulo) => {
      const featureCollection = turf.featureCollection(
        nodesByCum[cumulo].map((nodo) => {
          return turf.point(nodo.location.coordinates);
        })
      );
      const hull = turf.convex(featureCollection);
      hull.properties = {
        cumulo,
        cumuloName: nodesByCum[cumulo][0].nomenclatura.split('_')[1] ?? '',
        nodos: nodesByCum[cumulo].length,
        socio: this.getSocioValue(nodesByCum[cumulo]),
      };
      return hull;
    });

    this.map.addSource('cumulos-src', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: polygons,
      },
    });

    this.map.addLayer({
      id: 'cumulos-fill',
      type: 'fill',
      source: 'cumulos-src',
      paint: {
        'fill-color': '#ff8900',
        'fill-opacity': 0.6,
      },
      minzoom: 7,
    });

    this.map.addLayer({
      id: 'cumulos',
      type: 'line',
      source: 'cumulos-src',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#ff8900',
        'line-width': 2,
      },
      minzoom: 7,
    });

    this.map.addLayer({
      id: 'cumulos-label',
      type: 'symbol',
      source: 'cumulos-src',

      layout: {
        'text-field': 'Cúmulo {cumuloName}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 16,
      },
      paint: {
        'text-color': '#000000',
      },
      minzoom: 7,
    });

    const centroids = polygons.map((polygon) => {
      const c = turf.centroid(polygon);
      c.properties = polygon.properties;
      return c;
    });

    this.map.addSource('cumulos-centroides-src', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: centroids,
      },
    });

    this.map.addLayer({
      id: 'cumulos-point',
      type: 'circle',
      source: 'cumulos-centroides-src',
      paint: {
        'circle-color': '#ff8900',
        'circle-radius': 10,
      },
      maxzoom: 7,
    });

    this.map.addLayer({
      id: 'cumulos-point-count',
      type: 'symbol',
      source: 'cumulos-centroides-src',
      layout: {
        'text-field': '{cumuloName}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 8,
        'text-allow-overlap': true,
      },
      maxzoom: 7,
    });

    this.map.addLayer({
      id: 'cumulos-socio',
      type: 'symbol',
      source: 'cumulos-centroides-src',
      filter: ['!=', ['get', 'socio'], false],
      layout: {
        'icon-image': 'socio-2',
        'icon-anchor': 'top-left',
        'icon-allow-overlap': true,
        'icon-size': 0.025,
      },
      maxzoom: 7,
    });

    this.map.on('click', 'cumulos-point', (e) => {
      const { cumulo, cumuloName } = e.features[0].properties;
      this.goToCalendar(cumulo, cumuloName);
    });
  }

  setNodosLayers() {
    this.map.addSource('nodos-src', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.nodos.map((nodo) => {
          return {
            type: 'Feature',
            geometry: nodo.location,
            properties: {
              id: nodo.id,
              idSipecam: nodo.nomenclatura,
              conSocio: nodo.has_partner,
              integro: nodo.integrity,
              cumulo: nodo.cumulus_id,
              ecosistema: nodo.ecosystem_id,
            },
          };
        }),
      },
    });

    this.map.addLayer({
      id: 'nodos',
      type: 'circle',
      source: 'nodos-src',
      paint: {
        'circle-color': [
          'case',
          ['==', ['get', 'integro'], true],
          '#00ff00',
          ['==', ['get', 'integro'], false],
          '#ff0000',
          '#ff8900',
        ],
        'circle-radius': 5,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      },
      minzoom: 7,
    });

    this.map.on('click', 'nodos', (e) => {
      const { cumulo, id } = e.features[0].properties;
      this.showDetail(id, cumulo);
    });
  }

  showANPLayer(show: boolean) {
    const value = show ? 'visible' : 'none';

    ['anps', 'anps-line', 'anps-label'].forEach((layer) => {
      this.map.setLayoutProperty(layer, 'visibility', value);
    });
  }

  showCumulosLayer(show: boolean) {
    const value = show ? 'visible' : 'none';

    ['cumulos', 'cumulos-fill', 'cumulos-label', 'cumulos-point', 'cumulos-point-count'].forEach((layer) => {
      this.map.setLayoutProperty(layer, 'visibility', value);
    });
  }

  showSociosLayer(show: boolean) {
    const value = show ? 'visible' : 'none';

    ['cumulos-socio'].forEach((layer) => {
      this.map.setLayoutProperty(layer, 'visibility', value);
    });
  }

  async showDetail(id: string, cumulo?: string) {
    const modal = await this.modalCtrl.create({
      component: NodeDetailComponent,
      componentProps: { id, cumulo },
    });

    modal.present();
  }

  updateCentroids() {
    const nodesByCum = _.groupBy(this.nodos, 'id_cumulo');
    const centroids = Object.keys(nodesByCum).map((cumulo) => {
      const featureCollection = turf.featureCollection(
        nodesByCum[cumulo].map((s) => {
          const lng = s.longitud != 0 ? Number(s.longitud) : -99.1269;
          const lat = s.latitud != 0 ? Number(s.latitud) : 19.4978;
          return turf.point([lng, lat]);
        })
      );
      const center = turf.center(featureCollection);
      center.properties = { cumulo, nodos: nodesByCum[cumulo].length };
      return center;
    });

    this.map.getSource('cumulos-centroides-src').setData({
      type: 'FeatureCollection',
      features: centroids,
    });
  }
}
