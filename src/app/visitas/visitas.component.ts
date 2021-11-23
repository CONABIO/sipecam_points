import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { getVisits } from '@api/eventos';
import { visit } from 'graphql';

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
  comments: string;
  date_started_pristine: string;
  date_finished_pristine: string;
  date_started_disturbed: string;
  date_finished_disturbed: string;
}

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.scss'],
})
export class VisitasComponent implements OnInit {
  cumulo: any = null;
  cumuloId: string = null;

  visits: Visit[] = [];

  constructor(private apollo: Apollo, private route: ActivatedRoute) {
    this.cumuloId = this.route.snapshot.paramMap.get('id') || null;
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
      console.log('visits', visits);
      this.visits = visits.sort((a, b) => a.calendar.date_started.localeCompare(b.calendar.date_started));
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnInit() {
    await this.getVisits();
  }
}
