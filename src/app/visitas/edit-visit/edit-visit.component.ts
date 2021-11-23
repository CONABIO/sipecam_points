import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { updateVisit } from '@api/eventos';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import * as _ from 'lodash';

@Component({
  selector: 'app-edit-visit',
  templateUrl: './edit-visit.component.html',
  styleUrls: ['./edit-visit.component.scss'],
})
export class EditVisitComponent implements OnInit {
  fileError: string = null;
  isValidFile = false;
  loading: HTMLIonLoadingElement;
  nodeType = 'added';
  points: Array<any> = null;
  step = 0;

  visitForm!: FormGroup;

  visitId: string = null;

  constructor(
    private alertController: AlertController,
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) {
    this.createForm();
  }

  private createForm() {
    this.visitForm = this.formBuilder.group({
      comments: ['', Validators.required],
      date_started_pristine: ['', Validators.required],
      date_finished_pristine: ['', Validators.required],
      date_started_disturbed: ['', Validators.required],
      date_finished_disturbed: ['', Validators.required],
    });
  }

  async updateVisitAlert() {
    let alert;

    alert = await this.alertController.create({
      header: 'Editar visita',
      message: `¿Deseas guardar tus cambios?`,
      buttons: [
        'Cancelar',
        {
          text: 'Guardar',
          handler: async () => {
            await this.updateVisit();
          },
        },
      ],
    });

    await alert.present();
  }

  async updateVisit() {
    const { comments, date_started_pristine, date_finished_pristine, date_started_disturbed, date_finished_disturbed } =
      this.visitForm.value;

    try {
      const result = await this.apollo
        .mutate({
          mutation: updateVisit,
          variables: {
            id: this.visitId,
            comments,
            date_started_pristine,
            date_finished_pristine,
            date_started_disturbed,
          },
        })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {}

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ backdropDismiss: false });
    return await this.loading.present();
  }
}
