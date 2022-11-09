import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Apollo } from 'apollo-angular';
import { getEcosystems, getOneCumulus, getOneNode } from '@api/mapa';

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

  constructor(private apollo: Apollo, private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  async ngOnInit() {}
}
