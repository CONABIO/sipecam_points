import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
} from 'ng-apexcharts';

import { Apollo } from 'apollo-angular';
import { getVisits } from '@api/eventos';
import { getEcosystems } from '@api/mapa';
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

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-tablero-general',
  templateUrl: './tablero-general.component.html',
  styleUrls: ['./tablero-general.component.scss'],
})
export class TableroGeneralComponent implements OnInit {
  cumulo: any = null;
  cumuloId: string = null;

  visits: Visit[] = [];
  activeSection = 'visits';

  ecosystems: any = [];
  currentEcosystem: any = null;

  formulariosChart: Partial<ChartOptions> = {
    series: [
      {
        name: 'EBIE',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: 'Cámaras Trampa',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: 'Grabadoras',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
      {
        name: 'Peq. Mamíferos',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Cúm 1', 'Cúm 2', 'Cúm 3', 'Cúm 4', 'Cúm 5', 'Cúm 6', 'Cúm 7', 'Cúm 8', 'Cúm 9'],
    },
    yaxis: {
      title: {
        text: 'Cantidad',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' elementos';
        },
      },
    },
  };

  constructor(private alertController: AlertController, private apollo: Apollo, private route: ActivatedRoute) {
    this.cumuloId = this.route.snapshot.paramMap.get('id') || null;
  }

  segmentChanged(event: any) {
    this.activeSection = event.target.value;
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

  async getEcosystems() {
    try {
      const { data }: any = await this.apollo
        .query({
          query: getEcosystems,
          variables: {
            pagination: {
              limit: 15,
              offset: 0,
            },
          },
        })
        .toPromise();
      this.ecosystems = data?.ecosystems ?? [];
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnInit() {
    await this.getEcosystems();
    await this.getVisits();
  }
}
