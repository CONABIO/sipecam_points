import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../home/services/dashboard.service';
import { AlertController, ModalController } from '@ionic/angular';
import { AddSocioComponent } from './add-socio/add-socio.component';

import { environment } from '@env/environment';

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.scss'],
})
export class SociosComponent implements OnInit {
  nodes: any = [];

  constructor(
    private alertController: AlertController,
    private dashboardService: DashboardService,
    private modalController: ModalController
  ) {}

  async deleteSocio(id: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar socio',
      message: `¿Deseas eliminar al socio ${id}`,
      buttons: [
        'Cancelar',
        {
          text: 'Eliminar',
          handler: () => {
            console.log('Socio eliminado');
          },
        },
      ],
    });

    await alert.present();
  }

  async addSocio(socio?: any) {
    console.log('EDIT');
    const modal = await this.modalController.create({
      component: AddSocioComponent,
      componentProps: {
        socio,
      },
      // cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async getNodes() {
    try {
      this.nodes = await this.dashboardService.allPartnersGraphql();
    } catch (error) {
      console.log(error);
    }
  }
  ngOnInit() {
    this.getNodes();
  }
}
