import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { getVisits } from '@api/eventos';
import { getOneCumulus } from '@api/mapa';
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
  selector: 'app-tablero-particular',
  templateUrl: './tablero-particular.component.html',
  styleUrls: ['./tablero-particular.component.scss'],
})
export class TableroParticularComponent implements OnInit {
  cumulo: any = null;
  cumuloId: string = null;

  visits: Visit[] = [];

  activeSection = 'visits';

  generalChart = {
    series: [
      {
        name: 'Cantidad',
        data: [4, 3, 2],
      },
    ],
    chart: {
      height: 250,
      type: 'bar',
      toolbar: { show: false },
    },
    colors: ['#DF61C2', '#546E7A', '#008FFB'],
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: ['Visitas', 'Reportes', 'Monitores'],
      labels: {
        style: {
          colors: ['#DF61C2', '#546E7A', '#008FFB'],
          fontSize: '12px',
        },
      },
    },
    yaxis: [
      {
        seriesName: 'Cantidad',
        min: 0,
        forceNiceScale: true,
      },
    ],
  };

  devicesChart = {
    series: [0, 167, 3, 0],
    chart: {
      height: 250,
      type: 'pie',
    },
    labels: ['Inactivo', 'Activo', 'Descompostura', 'Robo'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  constructor(private alertController: AlertController, private apollo: Apollo, private route: ActivatedRoute) {
    this.cumuloId = this.route.snapshot.paramMap.get('id') || null;
  }

  segmentChanged(event: any) {
    this.activeSection = event.target.value;
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
    await this.getCumulo();
    await this.getVisits();
  }
}
