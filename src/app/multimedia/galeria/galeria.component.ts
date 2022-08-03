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
import { getDevices, getVisits, getDeployments, getIndividuals, getTransects } from '@api/tableros';
import { getEcosystems } from '@api/mapa';
import { AlertController } from '@ionic/angular';

import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgPager from 'lightgallery/plugins/pager';
import { BeforeSlideDetail } from 'lightgallery/lg-events';

import Imagenes from '@static/files/3_13_0_1398.json';

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
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss'],
})
export class GaleriaComponent implements OnInit {
  cumulo: any = null;
  cumuloId: string = null;

  settings = {
    thumbnail: true,
    plugins: [lgZoom, lgThumbnail],
  };

  imgList = Imagenes;

  constructor(private route: ActivatedRoute) {
    this.cumuloId = this.route.snapshot.paramMap.get('id') || null;
  }

  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    const { index, prevIndex } = detail;
    console.log(index, prevIndex);
  };

  async ngOnInit() {
    // const answer = await this.alfrescoService.audio();
  }
}
