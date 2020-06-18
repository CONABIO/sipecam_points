import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private apollo: Apollo, private http: HttpClient) {}

  private formatParams(params: object) {
    return Object.keys(params)
      .map((key) => {
        return key + '=' + encodeURIComponent(params[key]);
      })
      .join('&');
  }

  allNodesGraphql() {
    return new Promise((resolve, reject) => {
      this.apollo
        .watchQuery({
          query: gql`
            {
              allSitios {
                nodes {
                  idCumulo
                  ecosistema
                }
              }
            }
          `,
        })
        .valueChanges.subscribe(
          (result: any) => {
            console.log('graphql', result);
            resolve(result.data ? result.data.allSitios.nodes : []);
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  getEcosystems() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.serverUrl}/ecosystems`).subscribe(
        (data) => {
          console.log('nodes', data);
          resolve(data ? data : null);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  getAllNodes() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.serverUrl}/nodes`).subscribe(
        (data) => {
          console.log('nodes', data);
          resolve(data ? data : []);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  getFilteredNodes(ecosystem: string, integrity: string) {
    if (ecosystem == null && integrity == null) {
      return this.getAllNodes();
    }

    let url = `${environment.serverUrl}/both/${encodeURIComponent(ecosystem)}/${integrity}`;
    if (ecosystem == null) {
      url = `${environment.serverUrl}/filterintegrity/${integrity}`;
    }

    if (integrity == null) {
      url = `${environment.serverUrl}/filterecosystem/${encodeURIComponent(ecosystem)}`;
    }

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (data) => {
          console.log('filter nodes', data);
          resolve(data ? data : null);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  getNode(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.serverUrl}/idsipecam/${id}`).subscribe(
        (data) => {
          console.log('node', data);
          resolve(data ? data : null);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  getDashboard(params: any, paramsList: any) {
    return new Promise((resolve) => {
      const list = this.http.post(`${environment.serverUrl}/list`, paramsList);
      const filtered_data = this.http.post(`${environment.serverUrl}/filtered_data`, params);
      const timeseries = this.http.post(`${environment.serverUrl}/time_series`, params);

      forkJoin([list, filtered_data, timeseries]).subscribe(
        (data) => {
          resolve({
            list: data[0],
            filtered_data: data[1],
            timeseries: data[2],
          });
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }
}
