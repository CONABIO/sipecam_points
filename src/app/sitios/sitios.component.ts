import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../mapa/services/dashboard.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AddCumuloComponent } from './add-cumulo/add-cumulo.component';
import { UploadFileComponent } from './upload-file/upload-file.component';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { environment } from '@env/environment';

@Component({
  selector: 'app-sitios',
  templateUrl: './sitios.component.html',
  styleUrls: ['./sitios.component.scss'],
})
export class SitiosComponent implements OnInit {
  nodes: any = [];

  constructor(
    private alertController: AlertController,
    private apollo: Apollo,
    private dashboardService: DashboardService,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  async deleteCumulo(id: string, idSitio: string) {
    console.log('id', id);
    const alert = await this.alertController.create({
      header: 'Eliminar cúmulo',
      message: `¿Deseas elimininar el cúmulo ${idSitio}`,
      buttons: [
        'Cancelar',
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              const result = await this.apollo
                .mutate({
                  mutation: gql`
                    mutation {
                      deleteCumulus(input: {nodeId: "${id}"}) {
                        deletedCumulusId
                      }
                    }
                  `,
                })
                .toPromise();
              console.log(result);
              this.presentToast('Cúmulo eliminado');
              this.getNodes();
            } catch (error) {
              console.log(error);
              this.presentToast('Ocurrió un error');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async addCumulo(cumulo?: any) {
    console.log('EDIT');
    const modal = await this.modalController.create({
      component: AddCumuloComponent,
      componentProps: {
        cumulo,
      },
      // cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(() => {
      this.getNodes();
    });
    return await modal.present();
  }

  async getNodes() {
    try {
      this.nodes = await this.dashboardService.allCumulusesGraphql();
    } catch (error) {
      console.log(error);
    }
  }
  ngOnInit() {
    this.getNodes();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
    });
    toast.present();
  }

  async uploadFile() {
    const modal = await this.modalController.create({
      component: UploadFileComponent,
      // cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(() => {
      this.getNodes();
    });
    return await modal.present();
  }
}
