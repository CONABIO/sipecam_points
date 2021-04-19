import { Component, OnInit } from '@angular/core';
import { ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { addDays, isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';

import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';

import { DashboardService } from '../services/dashboard.service';

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
      firstVisit: null,
      secondVisit: null,
      title: 'Par de nodos 1',
      color: colors.red,
      degradedNode: null,
      notDegradedNode: null,
    },
    {
      firstVisit: null,
      secondVisit: null,
      title: 'Par de nodos 2',
      color: colors.blue,
      degradedNode: null,
      notDegradedNode: null,
    },
    {
      firstVisit: null,
      secondVisit: null,
      title: 'Par de nodos 3',
      color: colors.yellow,
      degradedNode: null,
      notDegradedNode: null,
    },
    {
      firstVisit: null,
      secondVisit: null,
      title: 'Par de nodos 4',
      color: colors.green,
      degradedNode: null,
      notDegradedNode: null,
    },
    {
      firstVisit: null,
      secondVisit: null,
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

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute) {
    this.cumuloId = this.route.snapshot.paramMap.get('id') || null;
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
      const points: any = await this.dashboardService.getAllNodes();
      const nodesByCum = _.groupBy(points, 'id_cumulo');
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
        visit.setDate(visit.getDate() - 3);

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
        visit.setDate(visit.getDate() - 3);

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
