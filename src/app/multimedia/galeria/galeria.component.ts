import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgPager from 'lightgallery/plugins/pager';
import lgVideo from 'lightgallery/plugins/video';
import { LightGallery } from 'lightgallery/lightgallery';
import { BeforeSlideDetail } from 'lightgallery/lg-events';

import Imagenes from '@static/files/3_13_0_1398.json';
import Node1_95_1_1350 from '@static/videos/1_95_1_1350.json';
import Node3_13_1_1392 from '@static/videos/3_13_1_1392.json';
import Node3_92_1_1334 from '@static/videos/3_92_1_1334.json';
import Node4_32_0_1281 from '@static/videos/4_32_0_1281.json';
import Node4_32_1_1286 from '@static/videos/4_32_1_1286.json';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss'],
})
export class GaleriaComponent implements OnInit {
  private lightGallery!: LightGallery;
  private needRefresh = false;

  cumulo: any = null;
  cumuloId: string = null;

  currentGallery = 'image';
  currentVideoNode = '1_95_1_1350';

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

  showVideoGallery = true;

  constructor(private route: ActivatedRoute) {
    this.cumuloId = this.route.snapshot.paramMap.get('id') || null;
  }

  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    const { index, prevIndex } = detail;
  };

  async ngOnInit() {
    // const answer = await this.alfrescoService.audio();
    this.videoList = this.getVideoUrls(Node1_95_1_1350);
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

  videoNodeChanged() {
    switch (this.currentVideoNode) {
      case '1_95_1_1350':
        this.videoList = this.getVideoUrls(Node1_95_1_1350);
        break;
      case '3_13_1_1392':
        this.videoList = this.getVideoUrls(Node3_13_1_1392);
        break;
      case '3_92_1_1334':
        this.videoList = this.getVideoUrls(Node3_92_1_1334);
        break;
      case '4_32_0_1281':
        this.videoList = this.getVideoUrls(Node4_32_0_1281);
        break;
      case '4_32_1_1286':
        this.videoList = this.getVideoUrls(Node4_32_1_1286);
        break;
    }

    this.needRefresh = true;
  }

  onInitVideoGallery = (detail): void => {
    this.lightGallery = detail.instance;
  };

  ngAfterViewChecked(): void {
    if (this.needRefresh) {
      this.lightGallery.refresh();
      this.needRefresh = false;
    }
  }
}
