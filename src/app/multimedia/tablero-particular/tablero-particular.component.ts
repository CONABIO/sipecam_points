import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

import { Apollo } from 'apollo-angular';
import { getVisits, getDevices } from '@api/tableros';
import { getOneCumulus } from '@api/mapa';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tablero-particular',
  templateUrl: './tablero-particular.component.html',
  styleUrls: ['./tablero-particular.component.scss'],
})
export class TableroParticularComponent implements OnInit {
  cumulo: any = null;
  cumuloId: string = null;

  visits: any = [];

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
            search: {
              field: 'cumulus_id',
              value: this.cumuloId,
              operator: 'eq',
            },
            pagination: {
              limit: 1000,
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

      this.devicesChart.labels = typeLabels;
      this.devicesChart.series = typeSeries;

      console.log('dev', devicesType);
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnInit() {
    await this.getCumulo();
    await this.getVisits();
    await this.getDevices();
  }
}
