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

import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgPager from 'lightgallery/plugins/pager';
import lgVideo from 'lightgallery/plugins/video';
import { BeforeSlideDetail } from 'lightgallery/lg-events';

import Imagenes from '@static/files/3_13_0_1398.json';
import Node3_13_1_1392 from '@static/videos/3_13_1_1392.json';

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

  currentGallery = 'image';
  currentVideoNode = '3_13_1_1392';

  settings = {
    thumbnail: true,
    plugins: [lgZoom, lgThumbnail],
  };

  settingsVideo = {
    thumbnail: true,
    plugins: [lgThumbnail, lgVideo],
    videojs: true,
  };

  imgList = Imagenes;
  videoList: any = [];

  constructor(private route: ActivatedRoute) {
    this.cumuloId = this.route.snapshot.paramMap.get('id') || null;
  }

  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    const { index, prevIndex } = detail;
  };

  async ngOnInit() {
    // const answer = await this.alfrescoService.audio();
    this.videoList = this.getVideoUrls(Node3_13_1_1392);
  }

  getVideoUrls(list: Object) {
    return Object.keys(list)
      .map((url) => url.replace('s3://sipecam-open-data', 'https://sipecam-open-data.s3.amazonaws.com'))
      .map((url) => {
        const obj = {
          source: [{ src: url, type: 'video/mp4' }],
          attributes: {
            preload: false,
            playsinline: true,
            controls: true,
          },
        };

        return JSON.stringify(obj);
      });
  }

  segmentChanged(event: any) {
    this.currentGallery = event.target.value;
  }

  videoNodeChanged() {}
}
