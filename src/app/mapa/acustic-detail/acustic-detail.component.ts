import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Apollo } from 'apollo-angular';

import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-acustic-detail',
  templateUrl: './acustic-detail.component.html',
  styleUrls: ['./acustic-detail.component.scss'],
})
export class AcusticDetailComponent implements OnInit {
  @Input() id: string;
  @Input() cumulo: string;

  map: mapboxgl.Map;
  node: any = null;
  cumulus: any = null;
  ecosystems: any = [];

  data = [
    {
      player_img_height: 385,
      sipecam_latitude: 18.4726,
      player_rate: 1800,
      player_min_freq: 0,
      player_dpi: 100,
      soundscape_plot_path:
        '/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/4_32_0_1281_2021-10-23T00:00:00.000+0000_248C7D075B1F81B1_18.4726_-99.1088_plot.png',
      sipecam_cumulusname: '32',
      soundscape_end_date: '2021-11-12T17:50:00',
      product_id: 1,
      sipecam_ecosystemsname: 'Selvas secas',
      sipecam_serialnumber: '248C7D075B1F81B1',
      player_img_width: 1162,
      sipecam_nodecategoryintegrity: 'Degradado',
      player_image_path:
        '/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/4_32_0_1281_2021-10-23T00:00:00.000+0000_248C7D075B1F81B1_18.4726_-99.1088.png',
      player_max_freq: 10000,
      player_step: 5,
      soundscape_season: 'Lluvias',
      soundscape_total_time: 172800.0,
      soundscape_duration: 20.0,
      soundscape_start_date: '2021-10-23T17:50:00',
      player_clip_path:
        '/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/4_32_0_1281_2021-10-23T00:00:00.000+0000_248C7D075B1F81B1_18.4726_-99.1088.wav',
      sipecam_datedeployment: '2021-10-23T00:00:00.000+0000',
      valid_pair: 3,
      sipecam_longitude: -99.1088,
      soundscape_total_files: 2880,
      id: '34d9b95b-29e5-4ef2-a383-2d75e65824bf',
      _version_: 1749500524410961920,
    },
    {
      player_img_height: 385,
      sipecam_latitude: 18.415,
      player_rate: 1800,
      player_min_freq: 0,
      player_dpi: 100,
      soundscape_plot_path:
        '/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/4_32_1_1286_2021-10-22T00:00:00.000+0000_242A260460379379_18.415_-99.0331_plot.png',
      sipecam_cumulusname: '32',
      soundscape_end_date: '2021-11-14T04:10:00',
      product_id: 3,
      sipecam_ecosystemsname: 'Selvas secas',
      sipecam_serialnumber: '242A260460379379',
      player_img_width: 1162,
      sipecam_nodecategoryintegrity: 'Integro',
      player_image_path:
        '/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/4_32_1_1286_2021-10-22T00:00:00.000+0000_242A260460379379_18.415_-99.0331.png',
      player_max_freq: 10000,
      player_step: 5,
      soundscape_season: 'Lluvias',
      soundscape_total_time: 172800.0,
      soundscape_duration: 20.0,
      soundscape_start_date: '2021-10-25T04:10:00',
      player_clip_path:
        '/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/4_32_1_1286_2021-10-22T00:00:00.000+0000_242A260460379379_18.415_-99.0331.wav',
      sipecam_datedeployment: '2021-10-22T00:00:00.000+0000',
      valid_pair: 1,
      sipecam_longitude: -99.0331,
      soundscape_total_files: 2880,
      id: '13e42b58-198c-40b8-9b39-e43af97f3702',
      _version_: 1749500524414107648,
    },
    {
      player_img_height: 385,
      sipecam_latitude: 18.4195,
      player_rate: 1800,
      player_min_freq: 0,
      player_dpi: 100,
      soundscape_plot_path:
        '/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/4_32_1_1287_2021-08-12T00:00:00.000+0000_243B1F055B1F95BF_18.4195_-98.9999_plot.png',
      sipecam_cumulusname: '32',
      soundscape_end_date: '2021-09-04T00:00:00',
      product_id: 9,
      sipecam_ecosystemsname: 'Selvas secas',
      sipecam_serialnumber: '243B1F055B1F95BF',
      player_img_width: 1162,
      sipecam_nodecategoryintegrity: 'Integro',
      player_image_path:
        '/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/4_32_1_1287_2021-08-12T00:00:00.000+0000_243B1F055B1F95BF_18.4195_-98.9999.png',
      player_max_freq: 10000,
      player_step: 5,
      soundscape_season: 'Lluvias',
      soundscape_total_time: 172800.0,
      soundscape_duration: 20.0,
      soundscape_start_date: '2021-08-15T00:00:00',
      player_clip_path:
        '/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/4_32_1_1287_2021-08-12T00:00:00.000+0000_243B1F055B1F95BF_18.4195_-98.9999.wav',
      sipecam_datedeployment: '2021-08-12T00:00:00.000+0000',
      valid_pair: 5,
      sipecam_longitude: -98.9999,
      soundscape_total_files: 2880,
      id: 'c7082eab-d962-4e0d-a562-2462ec88960c',
      _version_: 1749500524415156224,
    },
    {
      player_img_height: 385,
      sipecam_latitude: 18.4902,
      player_rate: 1800,
      player_min_freq: 0,
      player_dpi: 100,
      soundscape_plot_path:
        '/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/4_32_0_1280_2021-08-23T00:00:00.000+0000_248C7D075B1F81B1_18.4902_-99.137_plot.png',
      sipecam_cumulusname: '32',
      soundscape_end_date: '2021-09-15T22:00:00',
      product_id: 5,
      sipecam_ecosystemsname: 'Selvas secas',
      sipecam_serialnumber: '248C7D075B1F81B1',
      player_img_width: 1162,
      sipecam_nodecategoryintegrity: 'Degradado',
      player_image_path:
        '/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/4_32_0_1280_2021-08-23T00:00:00.000+0000_248C7D075B1F81B1_18.4902_-99.137.png',
      player_max_freq: 10000,
      player_step: 5,
      soundscape_season: 'Lluvias',
      soundscape_total_time: 172800.0,
      soundscape_duration: 20.0,
      soundscape_start_date: '2021-08-26T22:00:00',
      player_clip_path:
        '/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/4_32_0_1280_2021-08-23T00:00:00.000+0000_248C7D075B1F81B1_18.4902_-99.137.wav',
      sipecam_datedeployment: '2021-08-23T00:00:00.000+0000',
      valid_pair: 9,
      sipecam_longitude: -99.137,
      soundscape_total_files: 2880,
      id: 'acd8b39e-45c0-40f0-955e-3ebf6aa7224e',
      _version_: 1749500524416204800,
    },
  ];

  constructor(private apollo: Apollo, private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  getSoundscapeUrl(url: string) {
    const suffix = url.replace('/LUSTRE/sacmod/audio/sipecam/process_sipecam/cumulo_32/soundscape_player_data/', '');
    return `https://snmb.conabio.gob.mx/soundscape_snmb/cumulo_32/soundscape_player_data/${suffix}`;
  }

  async ngOnInit() {}
}
