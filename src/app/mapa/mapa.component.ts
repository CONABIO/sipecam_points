import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  ecosystems: any = [];
  integrity: string = 'null';
  map: mapboxgl.Map;
  points: any = [];

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
    private dashboardService: DashboardService,
    public filtersService: FiltersService,
    private modalCtrl: ModalController
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
      this.points = await this.dashboardService.getFilteredNodes(filters.ecosystem, filters.integrity);
      // console.log('points', this.points);
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
      this.updateCentroids();
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
      await this.getMapInfo();

      // console.log('*****', this.points);
      this.setCumulosLayers();

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
                id: s.fid_sipeca,
                ecosistema: s.ecosistema,
                integridad: s.cat_itegr,
                id_sipecam: s.id_sipe,
                id_cumulo: s.id_cumulo,
              },
            };
          }),
        },
      });

      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'points-src',
        // filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'integridad'], 'Integro'],
            '#00ff00',
            ['==', ['get', 'integridad'], 'Degradado'],
            '#ff0000',
            '#ff8900',
          ],
          'circle-radius': 5,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
        minzoom: 7,
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
    // console.log('graphql call');
    // this.dashboardService.graphql();
    this.filtersService.filtersObservable.subscribe((filters) => {
      // console.log('FILTERS', this.filters, filters);

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
    const nodesByCum = _.groupBy(this.points, 'id_cumulo');
    const polygons = Object.keys(nodesByCum).map((cumulo) => {
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
        'text-field': 'Cúmulo {cumulo}',
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
        'text-field': '{cumulo}',
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
      filter: ['!=', ['get', 'socio'], 0],
      layout: {
        'icon-image': 'socio-2',
        'icon-anchor': 'top-left',
        'icon-allow-overlap': true,
        'icon-size': 0.025,
      },
      paint: {
        'icon-color': [
          'case',
          ['==', ['get', 'socio'], 2],
          '#0088cc',
          ['==', ['get', 'socio'], 1],
          '#ffff00',
          '#ff8900',
        ],
      },
      maxzoom: 7,
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

  async showDetail(id: string) {
    const modal = await this.modalCtrl.create({
      component: NodeDetailComponent,
      componentProps: { id },
    });

    modal.present();
  }

  updateCentroids() {
    const nodesByCum = _.groupBy(this.points, 'id_cumulo');
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
