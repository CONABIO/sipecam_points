import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AlfrescoService {
  private httpOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: `Basic sololectura:000999000`,
      }),
    };
  }

  constructor(private http: HttpClient) {}

  audio() {
    return this.http
      .post(
        `${environment.alfresco.url2}`,
        {
          query: {
            query: '+TYPE: "sipecam:audio" AND -TYPE: "dummytype"',
          },
          fields: ['name', 'id'],
          paging: {
            maxItems: '1',
          },
        },
        this.httpOptions()
      )
      .toPromise()
      .then((data) => {
        console.log(data);
        return data;
      });
  }
}
