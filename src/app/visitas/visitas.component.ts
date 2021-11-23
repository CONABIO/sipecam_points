import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { getVisits, updateVisit } from '@api/eventos';
import { AlertController } from '@ionic/angular';

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

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.scss'],
})
export class VisitasComponent implements OnInit {
  cumulo: any = null;
  cumuloId: string = null;

  visits: Visit[] = [];

  constructor(private alertController: AlertController, private apollo: Apollo, private route: ActivatedRoute) {
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
      this.visits = visits
        .filter((v) => v.date_sipecam_first_season)
        .sort((a, b) => a.date_sipecam_first_season?.localeCompare(b.date_sipecam_first_season));
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnInit() {
    await this.getVisits();
  }

  async saveReports(variables: any) {
    try {
      const { data }: any = await this.apollo
        .mutate({
          mutation: updateVisit,
          variables,
        })
        .toPromise();
      const alert = await this.alertController.create({
        header: `Reporte actualizado`,
        buttons: ['Aceptar'],
      });

      await alert.present();
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
