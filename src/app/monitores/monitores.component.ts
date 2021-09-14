import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { addMonitor, deleteMonitor, getMonitores, updateMonitor } from '@api/eventos';
import { getOneCumulus } from '@api/mapa';

import { EditMonitorComponent } from './edit-monitor/edit-monitor.component';

export interface Monitor {
  id: string;
  first_name: string;
  last_name: string;
  second_last_name: string;
  contact: string;
}

@Component({
  selector: 'app-monitores',
  templateUrl: './monitores.component.html',
  styleUrls: ['./monitores.component.scss'],
})
export class MonitoresComponent implements OnInit {
  cumulo: any = null;
  cumuloId: string = null;

  monitores: Monitor[] = [];

  monitor = {
    first_name: null,
    last_name: null,
    second_last_name: null,
    contact: null,
  };

  constructor(
    private alertController: AlertController,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private modalController: ModalController
  ) {
    this.cumuloId = this.route.snapshot.paramMap.get('id') || null;
  }

  async addMonitor() {
    try {
      const { data } = await this.apollo
        .mutate<any>({
          mutation: addMonitor,
          variables: {
            ...this.monitor,
            addCumulus_monitor: this.cumuloId,
          },
        })
        .toPromise();

      this.monitores.push(data.addMonitor);
      this.monitor = {
        first_name: null,
        last_name: null,
        second_last_name: null,
        contact: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteMonitor(monitor: Monitor, index: number) {
    try {
      await this.apollo
        .mutate<any>({
          mutation: deleteMonitor,
          variables: {
            id: monitor.id,
          },
        })
        .toPromise();

      this.monitores.splice(index, 1);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteMonitorAlert(monitor: Monitor, index: number) {
    const alert = await this.alertController.create({
      header: `Eliminar monitor`,
      message: `¿Deseas eliminar al monitor ${monitor.first_name} ${monitor.last_name}? No podrás deshacer este cambio`,
      buttons: [
        'Cancelar',
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteMonitor(monitor, index);
          },
        },
      ],
    });

    await alert.present();
  }

  async editMonitorModal(monitor: Monitor, index: number) {
    const modal = await this.modalController.create({
      component: EditMonitorComponent,
      componentProps: {
        monitor,
      },
    });
    return await modal.present();
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

  async getMonitors() {
    try {
      const {
        data: { monitors },
      }: any = await this.apollo
        .query({
          query: getMonitores,
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
      console.log('mon', monitors);
      this.monitores = monitors;
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnInit() {
    await this.getCumulo();
    await this.getMonitors();
  }

  async updateMonitor(monitor: Monitor, index: number) {
    try {
      const { data } = await this.apollo
        .mutate<any>({
          mutation: updateMonitor,
          variables: {
            ...monitor,
          },
        })
        .toPromise();
      console.log(data);
      this.monitores[index] = data.updateMonitor;
    } catch (error) {
      console.log(error);
    }
  }
}
