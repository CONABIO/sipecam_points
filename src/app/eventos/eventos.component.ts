import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { addDays, isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';

import { Apollo } from 'apollo-angular';
import { addVisit, deleteVisit, getCalendar, getVisits, updateVisit } from '@api/eventos';
import { getOneCumulus, getNodes } from '@api/mapa';
import { CredentialsService } from '@app/auth';

import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';

import { environment } from '@env/environment';

import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import * as _ from 'lodash';

export interface Visit {
  id: string;
  user_id: number;
  calendar_id: number;
  cumulus_id: number;
  pristine_id: number;
  disturbed_id: number;
  calendar: {
    id: string;
    date_started: string;
    date_finished: string;
  };
  user_visit: {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  };
  cumulus_visit: {
    id: string;
    name: string;
  };
  unique_node_pristine: {
    id: string;
    nomenclatura: string;
    location: any;
    cat_integr: string;
    cumulus_id: number;
    ecosystem_id: number;
  };
  unique_node_disturbed: {
    id: string;
    nomenclatura: string;
    location: any;
    cat_integr: string;
    cumulus_id: number;
    ecosystem_id: number;
  };
}

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

  nodes: any[] = [];

  visits: Visit[] = [];

  constructor(
    private alertController: AlertController,
    private apollo: Apollo,
    private credentialsService: CredentialsService,
    private route: ActivatedRoute
  ) {
    this.cumuloId = this.route.snapshot.paramMap.get('id') || null;
  }

  async addOrUpdateVisit(variables) {
    try {
      const { data }: any = await this.apollo
        .mutate({
          mutation: variables.id ? updateVisit : addVisit,
          variables,
        })
        .toPromise();
      return variables.id ? data?.updateVisit : data?.addVisit;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  buildCalendarEvents() {
    const pairs = 5;
    const colorNames = ['red', 'blue', 'yellow', 'green', 'purple'];
    this.events = [];

    for (let i = 0; i < pairs; i++) {
      const currentVisits = this.visits.filter(
        (v) => v.calendar_id == this.calendarDates[i].id || v.calendar_id == this.calendarDates[i + pairs].id
      );

      let degradedNode = null;
      let notDegradedNode = null;
      if (currentVisits.length) {
        degradedNode = currentVisits[0].unique_node_disturbed?.id ?? null;
        notDegradedNode = currentVisits[0].unique_node_pristine?.id ?? null;
      }

      const firstVisit = currentVisits.find((v) => v.calendar_id == this.calendarDates[i].id);
      const secondVisit = currentVisits.find((v) => v.calendar_id == this.calendarDates[i + pairs].id);

      this.events.push({
        firstVisit: this.formatDate(this.calendarDates[i].date_started),
        secondVisit: this.formatDate(this.calendarDates[i + pairs].date_started),
        title: `Par de nodos ${i + 1}`,
        color: colors[colorNames[i]],
        degradedNode,
        notDegradedNode,
        firstVisitCalendarId: this.calendarDates[i].id,
        secondVisitCalendarId: this.calendarDates[i + pairs].id,
        firstVisitId: firstVisit?.id ?? null,
        secondVisitId: secondVisit?.id ?? null,
      });
    }
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
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

  async deleteVisit(variables) {
    try {
      await this.addOrUpdateVisit(variables);
      await this.apollo
        .mutate<any>({
          mutation: deleteVisit,
          variables: {
            id: variables.id,
          },
        })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
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

  flatpickrFactory() {
    flatpickr.localize(Spanish);
    return flatpickr;
  }

  formatDate(dateString: string) {
    return new Date(`${dateString} 00:00:00`).toISOString();
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

  async getVisits() {
    try {
      const {
        data: { visits },
      }: any = await this.apollo
        .query({
          query: getVisits,
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

      this.visits = visits;
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

      this.updateNodes();
      this.eventChanged();
    });
  }

  async ngAfterViewInit() {
    await this.getCumulo();
    await this.getNodes();
    await this.getVisits();
    await this.getCalendar();
    this.initMap();
    // this.deleteVisit({removeUnique_node_pristine: '1976', removeUnique_node_disturbed: '1979', id: '18'});
  }

  async ngOnInit() {
    this.flatpickrFactory();
  }

  async saveCalendar() {
    for (let event of this.events) {
      if (this.eventCompleted(event)) {
        const visit = {
          addUser_visit: this.credentialsService.credentials.decoded?.id,
          addCumulus_visit: this.cumuloId,
          addUnique_node_pristine: event.notDegradedNode,
          addUnique_node_disturbed: event.degradedNode,
        };

        //add or update first visit
        if (event.firstVisitId) {
          await this.addOrUpdateVisit({ ...visit, addCalendar: event.firstVisitCalendarId, id: event.firstVisitId });
        } else {
          const { id } = await this.addOrUpdateVisit({ ...visit, addCalendar: event.firstVisitCalendarId });
          event.firstVisitId = id;
        }

        //add or update second visit
        if (event.secondVisitId) {
          await this.addOrUpdateVisit({ ...visit, addCalendar: event.secondVisitCalendarId, id: event.secondVisitId });
        } else {
          const { id } = await this.addOrUpdateVisit({ ...visit, addCalendar: event.secondVisitCalendarId });
          event.secondVisitId = id;
        }
      } else {
        // delete visits
        const visit = {
          removeUser_visit: this.credentialsService.credentials.decoded?.id,
          removeCumulus_visit: this.cumuloId,
        };

        if (event.firstVisitId) {
          const originalVisit = this.visits.find((v) => v.id === event.firstVisitId);

          await this.deleteVisit({
            ...visit,
            removeCalendar: event.firstVisitCalendarId,
            removeUnique_node_pristine: originalVisit?.unique_node_pristine?.id,
            removeUnique_node_disturbed: originalVisit?.unique_node_disturbed?.id,
            id: event.firstVisitId,
          });
          event.firstVisitId = null;
        }

        if (event.secondVisitId) {
          const originalVisit = this.visits.find((v) => v.id === event.secondVisitId);

          await this.deleteVisit({
            ...visit,
            removeCalendar: event.secondVisitCalendarId,
            removeUnique_node_pristine: originalVisit?.unique_node_pristine?.id,
            removeUnique_node_disturbed: originalVisit?.unique_node_disturbed?.id,
            id: event.secondVisitId,
          });
          event.secondVisitId = null;
        }
      }

      await this.getVisits();
    }

    const alert = await this.alertController.create({
      header: `Calendario actualizado`,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  segmentChanged(event: any) {
    this.activeSection = event.target.value;
  }

  setView(view: CalendarView) {
    this.view = view;
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
