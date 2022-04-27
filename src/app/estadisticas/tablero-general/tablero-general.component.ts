import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
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
import { getDevices, getVisits } from '@api/tableros';
import { getEcosystems } from '@api/mapa';
import { AlertController } from '@ionic/angular';

export interface Visit {
  date_sipecam_second_season: string;
  date_first_season: string;
  date_second_season: string;
  cumulus_visit: {
    id: string;
    name: string;
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

  visits: any = null;
  activeSection = 'progress';

  ecosystems: any = [];
  currentEcosystem: any = 'todos';

  formulariosChart: Partial<ChartOptions> = {
    series: [
      {
        name: 'ERIE',
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

  visitasChart: Partial<ChartOptions> = {
    series: [
      {
        name: 'visitas',
        data: [],
      },
    ],
    chart: {
      height: 250,
      type: 'bar',
      toolbar: { show: false },
    },
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
    stroke: {
      width: 2,
    },
    xaxis: {
      categories: [],
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      seriesName: 'visitas',
      min: 0,
      forceNiceScale: true,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
  };

  devicesStatusChart = {
    series: [0, 0, 0, 0],
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

  devicesTypeChart = {
    series: [],
    chart: {
      height: 250,
      type: 'pie',
    },
    labels: [],
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

  async getVisits() {
    try {
      const {
        data: { visits },
      }: any = await this.apollo
        .query({
          query: getVisits,
          variables: {
            search: {
              field: 'date_first_season',
              value: null,
              operator: 'ne',
            },
            pagination: {
              limit: 1000,
              offset: 0,
            },
          },
        })
        .toPromise();
      this.visits = _.groupBy(visits, (v) => v.cumulus_visit.name);
      console.log('visits2', this.visits);
      const categories = [];
      const data = [];
      Object.keys(this.visits).forEach((cumulo) => {
        console.log('cumulo', cumulo);
        categories.push(`Cúm ${cumulo}`);
        const num = this.visits[cumulo]
          .map((visit) => (visit.date_second_season ? 2 : 1))
          .reduce((previous, current) => previous + current, 0);
        data.push(num);
      });
      this.visitasChart.series[0].data = data;
      this.visitasChart.xaxis = {
        categories: categories,
        labels: {
          style: {
            fontSize: '12px',
          },
        },
      };
      console.log('series', this.visitasChart);
    } catch (error) {
      console.log(error);
    }
  }

  async getDevices() {
    try {
      const {
        data: { physical_devices },
      }: any = await this.apollo
        .query({
          query: getDevices,
          variables: {
            pagination: {
              limit: 5000,
              offset: 0,
            },
          },
        })
        .toPromise();
      const devicesType = _.groupBy(physical_devices, (v) => v.device.type.toLowerCase());

      const typeLabels = [];
      const typeSeries = [];
      Object.keys(devicesType).forEach((key) => {
        typeLabels.push(key);
        typeSeries.push(devicesType[key].length);
      });

      this.devicesTypeChart.labels = typeLabels;
      this.devicesTypeChart.series = typeSeries;

      const devicesStatus = _.groupBy(physical_devices, (v) => v.status.toLowerCase());
      const statusLabels = [];
      const statusSeries = [];
      Object.keys(devicesStatus).forEach((key) => {
        statusLabels.push(key);
        statusSeries.push(devicesStatus[key].length);
      });

      this.devicesStatusChart.labels = statusLabels;
      this.devicesStatusChart.series = statusSeries;

      console.log('dev', devicesType, devicesStatus);
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
    await this.getDevices();
  }
}
