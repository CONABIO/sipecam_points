import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { UploadFileComponent } from './upload-file/upload-file.component';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sitios',
  templateUrl: './sitios.component.html',
  styleUrls: ['./sitios.component.scss'],
})
export class SitiosComponent implements OnInit {
  loading: HTMLIonLoadingElement;
  nodes: any = [];

  constructor(
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ backdropDismiss: false });
    return await this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
    });
    toast.present();
  }

  async downloadFile() {
    try {
      await this.presentLoading();

      const ws = XLSX.utils.json_to_sheet(this.nodes);

      /* add to workbook */
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Nodos');

      /* generate an XLSX file */
      XLSX.writeFile(wb, 'sipecam_nodos.xlsx');
    } catch (error) {
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async uploadFile() {
    const modal = await this.modalController.create({
      component: UploadFileComponent,
      // cssClass: 'my-custom-class'
    });

    return await modal.present();
  }
}
