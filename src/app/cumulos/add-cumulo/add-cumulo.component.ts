import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-add-cumulo',
  templateUrl: './add-cumulo.component.html',
  styleUrls: ['./add-cumulo.component.scss'],
})
export class AddCumuloComponent implements OnInit {
  @Input() cumulo: any = null;

  cumuloForm: FormGroup;

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.createForm();
  }

  createForm() {
    this.cumuloForm = this.formBuilder.group({
      idCumulo: ['', Validators.required],
      status: ['', Validators.required],
      criteria: ['', Validators.required],
      partner: ['', Validators.required],
      hasAgreement: [true, Validators.required],
      agreement: [''],
    });
  }

  fillForm() {
    Object.keys(this.cumulo).forEach((d) => {
      if (d !== 'id' && d !== 'nodeId' && d !== '__typename') {
        this.cumuloForm.get(d).setValue(this.cumulo[d]);
      }
    });
  }

  ngOnInit(): void {
    if (this.cumulo) {
      this.fillForm();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
    });
    toast.present();
  }

  async saveCumulo() {
    const data = JSON.stringify(this.cumuloForm.value)
      .replace(/\"([^"]+)\":/g, '$1:')
      .replace(/\uFFFF/g, '\\"');

    try {
      if (this.cumulo) {
        //update
        const result = await this.apollo
          .mutate({
            mutation: gql`
            mutation {
              updateCumulus(input: {
                nodeId: "${this.cumulo.nodeId}"
                cumulusPatch: ${data}
              }) {
                cumulus {
                  id
                  idCumulo
                }
              }
            }
          `,
          })
          .toPromise();
        console.log(result);
        this.presentToast('Cúmulo actualizado');
      } else {
        //create
        const result = await this.apollo
          .mutate({
            mutation: gql`
            mutation {
              createCumulus(input: {
                cumulus: ${data}
              }) {
                cumulus {
                  id
                  idCumulo
                }
              }
            }
          `,
          })
          .toPromise();
        console.log(result);
        this.presentToast('Cúmulo creado');
      }
    } catch (error) {
      console.log(error);
      this.presentToast('Ocurrió un error');
    } finally {
      this.modalController.dismiss();
    }
  }
}
