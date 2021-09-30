import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { addDays, isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';

import { Apollo } from 'apollo-angular';
import { addMonitor, addVisit, getCalendar, getMonitores } from '@api/eventos';
import { getOneCumulus, getNodes } from '@api/mapa';

import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';

import { environment } from '@env/environment';

import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import * as _ from 'lodash';

const colors: any = {
  red: {
    primary: '#f70808',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#75e208',
    secondary: '#CFE8B5',
  },
  purple: {
    primary: '#CD6EE7',
    secondary: '#DDB5E8',
  },
};

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit, AfterViewInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  locale: string = 'es';

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  events: any[] = [];

  calendarDates: any[] = [];
  calendarEvents: CalendarEvent[] = [];

  degradedNodes: any = [];

  notDegradedNodes: any = [];

  activeDayIsOpen: boolean = false;

  cumulo: any = null;
  cumuloId: string = null;

  activeSection = 'calendar';

  map: mapboxgl.Map;

  monitores: any = [];

  monitor = {
    first_name: null,
    last_name: null,
    second_last_name: null,
    contact: null,
  };

  nodes: any[] = [];

  constructor(private apollo: Apollo, private route: ActivatedRoute) {
    this.cumuloId = this.route.snapshot.paramMap.get('id') || null;
  }

  async addMonitor() {
    try {
      const result = await this.apollo
        .mutate({
          mutation: addMonitor,
          variables: {
            ...this.monitor,
            addCumulus_monitor: this.cumuloId,
          },
        })
        .toPromise();

      this.monitores.push({ ...this.monitor });
      this.monitor = {
        first_name: null,
        last_name: null,
        second_last_name: null,
        contact: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async addVisit() {
    try {
      const result = await this.apollo
        .mutate({
          mutation: addVisit,
          variables: {},
        })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  formatDate(dateString: string) {
    return new Date(`${dateString} 00:00:00`).toISOString();
  }

  buildCalendarEvents() {
    const pairs = 5;
    const colorNames = ['red', 'blue', 'yellow', 'green', 'purple'];
    this.events = [];

    for (let i = 0; i < pairs; i++) {
      this.events.push({
        firstVisit: this.formatDate(this.calendarDates[i].date_started),
        secondVisit: this.formatDate(this.calendarDates[i + pairs].date_started),
        title: `Par de nodos ${i + 1}`,
        color: colors[colorNames[i]],
        degradedNode: null,
        notDegradedNode: null,
        firstVisitId: this.calendarDates[i].id,
        secondVisitId: this.calendarDates[i + pairs].id,
      });
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  flatpickrFactory() {
    flatpickr.localize(Spanish);
    return flatpickr;
  }

  async getCalendar() {
    try {
      const {
        data: { calendars },
      }: any = await this.apollo
        .query({
          query: getCalendar,
          variables: {
            search: {
              field: 'sipecam_year',
              value: `${new Date().getFullYear()}`,
              operator: 'eq',
            },
            pagination: {
              limit: 10,
              offset: 0,
            },
          },
        })
        .toPromise();

      this.calendarDates = calendars.sort((a, b) => a.order - b.order);
      this.buildCalendarEvents();
    } catch (error) {
      console.log(error);
    }
  }

  async getCumulo() {
    try {
      const {
        data: { readOneCumulus },
      }: any = await this.apollo
        .query({
          query: getOneCumulus,
          variables: {
            id: this.cumuloId,
          },
        })
        .toPromise();

      this.cumulo = readOneCumulus;
    } catch (error) {
      console.log(error);
    }
  }

  async getMonitors() {
    try {
      const {
        data: { monitors },
      }: any = await this.apollo
        .query({
          query: getMonitores,
          variables: {
            search: {
              field: 'cumulus_id',
              value: this.cumuloId,
              operator: 'eq',
            },
            pagination: {
              limit: 100,
              offset: 0,
            },
          },
        })
        .toPromise();

      this.monitores = monitors;
    } catch (error) {
      console.log(error);
    }
  }

  async getNodes() {
    try {
      const {
        data: { nodes },
      }: any = await this.apollo
        .query({
          query: getNodes,
          variables: {
            search: {
              field: 'cumulus_id',
              value: this.cumuloId,
              operator: 'eq',
            },
            pagination: {
              limit: 50,
              offset: 0,
            },
          },
        })
        .toPromise();

      this.nodes = nodes;
      this.degradedNodes = nodes
        .filter((n) => n.cat_integr === 'Degradado')
        .map((n) => ({ id: n.id, name: n.nomenclatura, geometry: n.location, selected: false }));
      this.notDegradedNodes = nodes
        .filter((n) => n.cat_integr === 'Integro')
        .map((n) => ({ id: n.id, name: n.nomenclatura, geometry: n.location, selected: false }));
    } catch (error) {
      console.log(error);
    }
  }

  initMap() {
    const {
      geometry: { coordinates },
    } = turf.centroid(this.cumulo.geometry);

    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'event-map',
      style: environment.mapbox.style,
      center: coordinates,
      zoom: 8,
    });

    this.map.on('load', () => {
      this.map.resize();
      this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-left');

      // add Cumulus layers
      this.map.addSource('cumulos-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: this.cumulo.geometry,
            },
          ],
        },
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
      });

      // add not degraded nodes layers
      this.map.addSource('nodos-integros-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.notDegradedNodes.map((node) => {
            return {
              type: 'Feature',
              geometry: node.geometry,
              properties: {
                name: node.name,
                selected: node.selected,
              },
            };
          }),
        },
      });

      this.map.addLayer({
        id: 'nodos-integros',
        type: 'circle',
        source: 'nodos-integros-src',
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'selected'], true],
            '#e3e3e3',
            ['==', ['get', 'selected'], false],
            '#00ff00',
            '#ff8900',
          ],
          'circle-radius': 5,
        },
      });

      // add degraded nodes layers
      this.map.addSource('nodos-degradados-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.degradedNodes.map((node) => {
            return {
              type: 'Feature',
              geometry: node.geometry,
              properties: {
                name: node.name,
                selected: node.selected,
              },
            };
          }),
        },
      });

      this.map.addLayer({
        id: 'nodos-degradados',
        type: 'circle',
        source: 'nodos-degradados-src',
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'selected'], true],
            '#e3e3e3',
            ['==', ['get', 'selected'], false],
            '#ff0000',
            '#ff8900',
          ],
          'circle-radius': 5,
        },
      });
    });

    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
    });

    const layers = ['nodos-integros', 'nodos-degradados'];

    layers.map((layer) => {
      this.map.on('mouseenter', layer, (e) => {
        this.map.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const nodeName = e.features[0].properties.name;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates).setHTML(nodeName).addTo(this.map);
      });

      this.map.on('mouseleave', 'places', () => {
        this.map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });
  }

  async ngAfterViewInit() {
    await this.getCalendar();
    await this.getCumulo();
    await this.getNodes();
    await this.getMonitors();
    this.initMap();
  }

  async ngOnInit() {
    this.flatpickrFactory();
  }

  eventChanged() {
    this.calendarEvents = [];
    this.events.forEach((event) => {
      if (!this.eventCompleted(event)) {
        return;
      }

      if (event.firstVisit) {
        const visit = new Date(event.firstVisit);
        visit.setDate(visit.getDate());

        const first: CalendarEvent = {
          start: visit,
          end: addDays(visit, 35),
          title: `${event.title} - Visita seca`,
          color: event.color,
          allDay: true,
        };

        this.calendarEvents.push(first);
      }

      if (event.secondVisit) {
        const visit = new Date(event.secondVisit);
        visit.setDate(visit.getDate());

        const second: CalendarEvent = {
          start: visit,
          end: addDays(visit, 35),
          title: `${event.title} - Visita lluvia`,
          color: event.color,
          allDay: true,
        };

        this.calendarEvents.push(second);
      }
    });
    this.updateNodes();
  }

  eventCompleted(event: any) {
    return event.degradedNode && event.notDegradedNode && (event.firstVisit || event.secondVisit);
  }

  segmentChanged(event: any) {
    this.activeSection = event.target.value;
  }

  updateNodes() {
    this.degradedNodes.forEach((node, index) => {
      const selected = this.events.find((event) => event.degradedNode === node.id);
      this.degradedNodes[index].selected = !!selected;
    });

    this.notDegradedNodes.forEach((node, index) => {
      const selected = this.events.find((event) => event.notDegradedNode === node.id);
      this.notDegradedNodes[index].selected = !!selected;
    });

    this.map.getSource('nodos-integros-src').setData({
      type: 'FeatureCollection',
      features: this.notDegradedNodes.map((node) => {
        return {
          type: 'Feature',
          geometry: node.geometry,
          properties: {
            name: node.name,
            selected: node.selected,
          },
        };
      }),
    });

    this.map.getSource('nodos-degradados-src').setData({
      type: 'FeatureCollection',
      features: this.degradedNodes.map((node) => {
        return {
          type: 'Feature',
          geometry: node.geometry,
          properties: {
            name: node.name,
            selected: node.selected,
          },
        };
      }),
    });
  }
}
