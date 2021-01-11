import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import * as _ from 'lodash';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit {
  fileError: string = null;
  isValidFile = false;
  loading: HTMLIonLoadingElement;
  nodeType = 'added';
  points: Array<any> = null;
  step = 0;

  addedNodes: Array<any> = [];
  editedNodes: Array<any> = [];
  deletedNodes: Array<any> = [];

  constructor(
    private alertController: AlertController,
    private apollo: Apollo,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) {}

  async addSites() {
    for (let site of this.addedNodes) {
      const data = JSON.stringify(site)
        .replace(/\"([^"]+)\":/g, '$1:')
        .replace(/\uFFFF/g, '\\"');

      const result = await this.apollo
        .mutate({
          mutation: gql`
            mutation {
              createSitio(input: {
                sitio: ${data}
              }) {
                sitio {
                  id
                }
              }
            }
          `,
        })
        .toPromise();
      console.log(result);
    }
  }

  async deleteNode(nodeType: string, index: number = -1) {
    let alert;

    if (index >= 0) {
      alert = await this.alertController.create({
        header: 'Eliminar sitio',
        message: `¿Deseas eliminar el sitio de la lista?`,
        buttons: [
          'Cancelar',
          {
            text: 'Eliminar',
            handler: () => {
              switch (nodeType) {
                case 'added':
                  this.addedNodes.splice(index, 1);
                  break;
                case 'edited':
                  this.editedNodes.splice(index, 1);
                  break;
                case 'deleted':
                  this.deletedNodes.splice(index, 1);
                  break;
                default:
                  break;
              }
            },
          },
        ],
      });
    } else {
      alert = await this.alertController.create({
        header: 'Eliminar todos los sitios',
        message: `¿Deseas eliminar la lista?`,
        buttons: [
          'Cancelar',
          {
            text: 'Eliminar',
            handler: () => {
              switch (nodeType) {
                case 'added':
                  this.addedNodes = [];
                  break;
                case 'edited':
                  this.editedNodes = [];
                  break;
                case 'deleted':
                  this.deletedNodes = [];
                  break;
                default:
                  break;
              }
            },
          },
        ],
      });
    }

    await alert.present();
  }

  async deleteSites() {
    for (let site of this.deletedNodes) {
      const result = await this.apollo
        .mutate({
          mutation: gql`
            mutation {
              deleteSitio(input: {
                nodeId: "${site.nodeId}"
              }) {
                deletedSitioId
                sitio {
                  nodeId
                }
              }
            }
          `,
        })
        .toPromise();
      console.log(result);
    }
  }

  async editSites() {
    for (let site of this.editedNodes) {
      const data = JSON.stringify(site[1])
        .replace(/\"([^"]+)\":/g, '$1:')
        .replace(/\uFFFF/g, '\\"');

      const result = await this.apollo
        .mutate({
          mutation: gql`
            mutation {
              updateSitio(input: {
                nodeId: "${site[0].nodeId}"
                sitioPatch: ${data}
              }) {
                sitio {
                  nodeId
                }
              }
            }
          `,
        })
        .toPromise();
      console.log(result);
    }
  }

  async getNodes() {
    let nodes = [];

    try {
      const existingNodes: any = await this.apollo
        .query({
          query: gql`
            {
              allSitios {
                nodes {
                  id
                  idSipe
                  idCumulo
                  idEcosist
                  catItegr
                  ecosistema
                  altitud
                  latitud
                  longitud
                  nodeId
                  idSocio
                  conSocio
                }
              }
            }
          `,
        })
        .toPromise();
      nodes = existingNodes.data.allSitios.nodes;
    } catch (error) {
      console.log(error);
    } finally {
      return nodes;
    }
  }

  ngOnInit(): void {}

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ backdropDismiss: false });
    return await this.loading.present();
  }

  async processPoints() {
    try {
      this.step++;
      this.presentLoading();
      this.toDatabaseFormat();
      const nodes = await this.getNodes();
      console.log('Nodos', nodes.length);

      const compareFun = (a: any, b: any) => a.idSipe.localeCompare(b.idSipe);

      this.addedNodes = _.differenceBy(this.points, nodes, 'idSipe').sort(compareFun);
      const bef = _.intersectionBy(nodes, this.points, 'idSipe');
      const aft = _.intersectionBy(this.points, nodes, 'idSipe');
      const join = _.groupBy([...bef, ...aft], 'idSipe');

      for (let item in join) {
        this.editedNodes.push(join[item]);
      }
      this.editedNodes.sort((a: any, b: any) => a[0].idSipe.localeCompare(b[0].idSipe));
      this.deletedNodes = _.differenceBy(nodes, this.points, 'idSipe').sort(compareFun);
    } catch (error) {
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async readFile(file: File) {
    try {
      await this.presentLoading();

      const reader = new FileReader();
      reader.onload = (event: any) => {
        const data = event.target.result;
        const workBook: any = XLSX.read(data, { type: 'binary' });

        const sheets = workBook.SheetNames.map((sheetName: string) => {
          const sheet = workBook.Sheets[sheetName];
          return XLSX.utils.sheet_to_json(sheet);
        });

        const points = sheets[0];
        this.isValidFile = this.validateFormatFile(points);
        if (this.isValidFile) {
          this.points = points;
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async saveSites() {
    const alert = await this.alertController.create({
      message: `¿Guardar cambios?`,
      buttons: [
        'Cancelar',
        {
          text: 'Guardar',
          handler: async () => {
            try {
              this.presentLoading();
              await this.addSites();
              await this.editSites();
              await this.deleteSites();
              this.step++;
            } catch (error) {
              console.log(error);
            } finally {
              this.loading.dismiss();
            }
          },
        },
      ],
    });
    alert.present();
  }

  toDatabaseFormat() {
    this.points = this.points.map((point) => {
      return {
        idSipe: point.id_sipe,
        idCumulo: point['ID_Cúmulo'],
        idEcosist: point.id_Ecosist,
        catItegr: point.cat_itegr,
        ecosistema: point.Ecosistema,
        altitud: point.Altitud_m,
        latitud: point.LATITUD.toString(),
        longitud: point.LONGITUD.toString(),
        fidSipe1: point.FID_sipe_1,
        idSocio: point.id_socio,
        conSocio: point.con_socio,
      };
    });

    console.log('***', this.points);
  }

  validateFormatFile(points: any[]) {
    const columns = [
      'FID_sipe_1',
      'LONGITUD',
      'LATITUD',
      'Altitud_m',
      'id_Ecosist',
      'Ecosistema',
      'ID_Cúmulo',
      'cat_itegr',
      'id_sipe',
      'id_socio',
      'con_socio',
    ];

    for (let p of points) {
      for (let key in p) {
        if (!columns.includes(key)) {
          this.fileError = `${key} es una columna no válida`;
          return false;
        }
      }
    }

    return true;
  }
}
