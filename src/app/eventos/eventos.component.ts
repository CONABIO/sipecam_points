import { Component, OnInit } from '@angular/core';

import { ViewChild, TemplateRef } from '@angular/core';
import { addDays, isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';

import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';

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

  degradedNodes = ['3_92_0_1336', '3_92_0_1339', '3_92_0_1341', '3_92_0_1342', '3_92_0_1343'];

  notDegradedNodes = ['3_92_1_1334', '3_92_1_1335', '3_92_1_1337', '3_92_1_1338', '3_92_1_1340'];

  activeDayIsOpen: boolean = false;

  constructor() {}

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

  ngOnInit() {
    this.flatpickrFactory();
  }

  eventChanged() {
    this.calendarEvents = [];
    this.events.forEach((event) => {
      if (!this.eventCompleted(event)) {
        return;
      }

      if (event.firstVisit) {
        const first: CalendarEvent = {
          start: event.firstVisit,
          end: addDays(new Date(event.firstVisit), 29),
          title: `${event.title} - Visita seca`,
          color: event.color,
          allDay: true,
        };

        this.calendarEvents.push(first);
      }

      if (event.secondVisit) {
        const second: CalendarEvent = {
          start: event.secondVisit,
          end: addDays(new Date(event.secondVisit), 29),
          title: `${event.title} - Visita lluvia`,
          color: event.color,
          allDay: true,
        };

        this.calendarEvents.push(second);
      }
    });
  }

  eventCompleted(event: any) {
    return event.degradedNode && event.notDegradedNode && (event.firstVisit || event.secondVisit);
  }
}
