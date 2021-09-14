import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Apollo } from 'apollo-angular';
import { getOneCumulus, getOneNode } from '@api/mapa';

import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';

export interface Monitor {
  id: string;
  first_name: string;
  last_name: string;
  second_last_name: string;
  contact: string;
}

@Component({
  selector: 'app-edit-monitor',
  templateUrl: './edit-monitor.component.html',
  styleUrls: ['./edit-monitor.component.scss'],
})
export class EditMonitorComponent implements OnInit {
  @Input() data: Monitor;

  monitor = {
    first_name: null,
    last_name: null,
    second_last_name: null,
    contact: null,
  };

  constructor(private apollo: Apollo, private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  ngOnInit() {}

  updateMonitor() {}
}
