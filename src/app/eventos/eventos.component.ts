import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  comments: string;
  date_sipecam_first_season: string;
  date_sipecam_second_season: string;
  date_first_season: string;
  date_second_season: string;
  report_first_season: string;
  report_second_season: string;
  cumulus_id: number;
  pristine_id: number;
  disturbed_id: number;
  monitor_ids: number[];
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

  userAssociated = false;

  constructor(
    private alertController: AlertController,
    private apollo: Apollo,
    private credentialsService: CredentialsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.cumuloId = this.route.snapshot.paramMap.get('id') || null;
    if (!this.credentialsService.isAdmin() && this.credentialsService.isPartner()) {
      const isUserAssociated = this.credentialsService.cumulus.indexOf(Number(this.cumuloId)) > -1;
      if (!isUserAssociated) {
        this.router.navigate(['/'], { replaceUrl: true });
      }
    }
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
      const currentVisit = this.visits.length ? this.visits[i] : null;

      let degradedNode = null;
      let notDegradedNode = null;
      if (currentVisit) {
        degradedNode = currentVisit.unique_node_disturbed?.id ?? null;
        notDegradedNode = currentVisit.unique_node_pristine?.id ?? null;
      }

      const myFirstVisitSipecamDate = currentVisit?.date_sipecam_first_season ?? this.calendarDates[i].date_started;
      const mySecondVisitSipecamDate =
        currentVisit?.date_sipecam_second_season ?? this.calendarDates[i + pairs].date_started;

      this.events.push({
        title: `Par de nodos ${i + 1}`,
        color: colors[colorNames[i]],
        degradedNode,
        notDegradedNode,
        myFirstVisit: currentVisit?.date_first_season ?? null,
        mySecondVisit: currentVisit?.date_second_season ?? null,
        myFirstVisitSipecam: this.formatDate(myFirstVisitSipecamDate),
        mySecondVisitSipecam: this.formatDate(mySecondVisitSipecamDate),
        myFirstVisitSipecamString: myFirstVisitSipecamDate,
        mySecondVisitSipecamString: mySecondVisitSipecamDate,
        visitId: currentVisit?.id ?? null,
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

      if (event.myFirstVisit) {
        const visit = new Date(this.formatDate(event.myFirstVisit));
        visit.setDate(visit.getDate());

        const first: CalendarEvent = {
          start: visit,
          end: addDays(visit, 35),
          title: `${event.title} - Primera estación`,
          color: event.color,
          allDay: true,
        };

        this.calendarEvents.push(first);
      }

      if (event.mySecondVisit) {
        const visit = new Date(this.formatDate(event.mySecondVisit));
        visit.setDate(visit.getDate());

        const second: CalendarEvent = {
          start: visit,
          end: addDays(visit, 35),
          title: `${event.title} - Segunda estación`,
          color: event.color,
          allDay: true,
        };

        this.calendarEvents.push(second);
      }
    });
    this.updateNodes();
  }

  eventCompleted(event: any) {
    return event.degradedNode && event.notDegradedNode;
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

      this.visits = visits.filter((v) => v.date_sipecam_first_season && v.date_sipecam_second_season);
      // .sort((a, b) => a.date_sipecam_first_season.localeCompare(b.date_sipecam_second_season));
      this.buildCalendarEvents();
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
    await this.getCalendar();
    await this.getVisits();
    this.initMap();
  }

  async ngOnInit() {
    this.flatpickrFactory();
  }

  async saveCalendar() {
    if (this.visits.length) {
      for (let event of this.events) {
        // update visits
        if (this.eventCompleted(event)) {
          const visit = {
            addUnique_node_pristine: event.notDegradedNode ?? null,
            addUnique_node_disturbed: event.degradedNode ?? null,
            date_first_season: event.myFirstVisit?.length ? event.myFirstVisit : null,
            date_second_season: event.mySecondVisit?.length ? event.mySecondVisit : null,
          };

          if (event.visitId) {
            await this.addOrUpdateVisit({ ...visit, id: event.visitId });
          }
        } else {
          const visit = {
            removeUnique_node_pristine: null, // send node id
            removeUnique_node_disturbed: null,
            date_first_season: null,
            date_second_season: null,
          };

          if (event.visitId) {
            await this.addOrUpdateVisit({ ...visit, id: event.visitId });
          }
        }
      }
    } else {
      // add only the first visit
      const event = this.events[0];
      if (this.eventCompleted(event)) {
        const visit = {
          addCumulus_visit: this.cumuloId,
          addUnique_node_pristine: event.notDegradedNode,
          addUnique_node_disturbed: event.degradedNode,
          date_first_season: event.myFirstVisit?.length ? event.myFirstVisit : null,
          date_second_season: event.mySecondVisit?.length ? event.mySecondVisit : null,
        };

        const { id } = await this.addOrUpdateVisit({ ...visit });
        this.events[0].visitId = id;
      }
    }

    await this.getVisits();

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
