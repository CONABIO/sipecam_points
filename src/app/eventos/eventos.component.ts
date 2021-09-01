import { Component, OnInit } from '@angular/core';
import { ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { addDays, isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';

import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';

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

  events: any[] = [
    {
      firstVisit: '2021-06-21T00:00:00-05:00',
      secondVisit: '2021-12-18T00:00:00-06:00',
      title: 'Par de nodos 1',
      color: colors.red,
      degradedNode: null,
      notDegradedNode: null,
    },
    {
      firstVisit: '2021-07-27T00:00:00-05:00',
      secondVisit: '2022-01-23T00:00:00-06:00',
      title: 'Par de nodos 2',
      color: colors.blue,
      degradedNode: null,
      notDegradedNode: null,
    },
    {
      firstVisit: '2021-09-01T00:00:00-05:00',
      secondVisit: '2022-02-28T00:00:00-06:00',
      title: 'Par de nodos 3',
      color: colors.yellow,
      degradedNode: null,
      notDegradedNode: null,
    },
    {
      firstVisit: '2021-10-07T00:00:00-05:00',
      secondVisit: '2022-04-05T00:00:00-05:00',
      title: 'Par de nodos 4',
      color: colors.green,
      degradedNode: null,
      notDegradedNode: null,
    },
    {
      firstVisit: '2021-11-12T00:00:00-06:00',
      secondVisit: '2022-05-11T00:00:00-05:00',
      title: 'Par de nodos 5',
      color: colors.purple,
      degradedNode: null,
      notDegradedNode: null,
    },
  ];

  calendarEvents: CalendarEvent[] = [];

  degradedNodes: any = [];

  notDegradedNodes: any = [];

  activeDayIsOpen: boolean = false;

  cumuloId: string = null;

  activeSection = 'calendar';

  monitores: any = [];

  monitor = {
    nombre: null,
    apellidoPaterno: null,
    apellidoMaterno: null,
    contacto: null,
  };

  constructor(private route: ActivatedRoute) {
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

  async getNodes() {
    try {
      const nodesByCum = _.groupBy([], 'id_cumulo');
      const nodes = nodesByCum[this.cumuloId];
      this.degradedNodes = nodes
        .filter((n) => n.cat_itegr === 'Degradado')
        .map((n) => ({ id: n.id_sipe, selected: false }));
      this.notDegradedNodes = nodes
        .filter((n) => n.cat_itegr === 'Integro')
        .map((n) => ({ id: n.id_sipe, selected: false }));
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit() {
    this.flatpickrFactory();
    this.getNodes();
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
