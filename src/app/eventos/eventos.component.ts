import { Component, OnInit } from '@angular/core';
import { ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { addDays, isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';

import { Apollo } from 'apollo-angular';
import { getCalendar } from '@api/eventos';
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
export class EventosComponent implements OnInit {
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
    nombre: null,
    apellidoPaterno: null,
    apellidoMaterno: null,
    contacto: null,
  };

  nodes: any[] = [];

  constructor(private apollo: Apollo, private route: ActivatedRoute) {
    this.cumuloId = this.route.snapshot.paramMap.get('id') || null;
  }

  addMonitor() {
    this.monitores.push({ ...this.monitor });
    this.monitor = {
      nombre: null,
      apellidoPaterno: null,
      apellidoMaterno: null,
      contacto: null,
    };
  }

  buildCalendarEvents() {
    this.events = [
      {
        firstVisit: this.calendarDates[0].date_started,
        secondVisit: this.calendarDates[5].date_started,
        title: 'Par de nodos 1',
        color: colors.red,
        degradedNode: null,
        notDegradedNode: null,
      },
      {
        firstVisit: this.calendarDates[1].date_started,
        secondVisit: this.calendarDates[6].date_started,
        title: 'Par de nodos 2',
        color: colors.blue,
        degradedNode: null,
        notDegradedNode: null,
      },
      {
        firstVisit: this.calendarDates[2].date_started,
        secondVisit: this.calendarDates[7].date_started,
        title: 'Par de nodos 3',
        color: colors.yellow,
        degradedNode: null,
        notDegradedNode: null,
      },
      {
        firstVisit: this.calendarDates[3].date_started,
        secondVisit: this.calendarDates[8].date_started,
        title: 'Par de nodos 4',
        color: colors.green,
        degradedNode: null,
        notDegradedNode: null,
      },
      {
        firstVisit: this.calendarDates[4].date_started,
        secondVisit: this.calendarDates[9].date_started,
        title: 'Par de nodos 5',
        color: colors.purple,
        degradedNode: null,
        notDegradedNode: null,
      },
    ];
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
            pagination: {
              limit: 10,
              offset: 0,
            },
          },
        })
        .toPromise();

      this.calendarDates = calendars;
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
        .map((n) => ({ id: n.nomenclatura, geometry: n.location, selected: false }));
      this.notDegradedNodes = nodes
        .filter((n) => n.cat_integr === 'Integro')
        .map((n) => ({ id: n.nomenclatura, geometry: n.location, selected: false }));
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
      container: 'map',
      style: environment.mapbox.style,
      center: coordinates,
      zoom: 7.5,
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
  }

  async ngOnInit() {
    this.flatpickrFactory();
    await this.getCalendar();
    await this.getCumulo();
    await this.getNodes();
    this.initMap();
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

    console.log(this.degradedNodes);
  }
}
