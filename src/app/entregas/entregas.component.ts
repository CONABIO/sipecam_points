import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { getFileDelivers } from '@api/eventos';

export interface FileDelivers {
  node_delivered_files: {
    fid: number;
    nomenclatura: string;
  };
  who_delivers: string;
  reception_date: string;
  audio_files: number;
  video_files: number;
  image_files: number;
  total_files: number;
}

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.scss'],
})
export class EntregasComponent implements OnInit {
  fileDelivers: FileDelivers[] = [];
  searchFilterList: FileDelivers[] = [];
  searchField: string = 'node';
  currentSearchValue: string = '';

  constructor(private apollo: Apollo) {}

  async getFileDelivers() {
    try {
      const {
        data: { delivered_files },
      }: any = await this.apollo
        .query({
          query: getFileDelivers,
          variables: {
            pagination: {
              limit: 100,
              offset: 0,
            },
          },
        })
        .toPromise();
      this.fileDelivers = delivered_files;
      this.searchFilterList = delivered_files;
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnInit() {
    await this.getFileDelivers();
  }

  onSearchInput(value: string) {
    this.currentSearchValue = value;
    if (value.length) {
      this.searchFilterList = this.fileDelivers.filter((d) => {
        let fieldToFilter: string;
        if (this.searchField.includes('node')) fieldToFilter = d.node_delivered_files.fid.toString();
        else if (this.searchField.includes('who_delivers')) fieldToFilter = d.who_delivers.toLowerCase();
        else if (this.searchField.includes('reception_date'))
          fieldToFilter = d.reception_date.split('-').reverse().join().replace(/,/g, '/');

        return fieldToFilter.indexOf(value.toLowerCase()) > -1;
      });
    } else {
      this.searchFilterList = this.fileDelivers;
    }
  }

  onSelect(value: any) {
    this.searchField = value;
    this.onSearchInput(this.currentSearchValue);
  }

  getTotals(field: string) {
    let total = 0;
    this.searchFilterList.forEach((f) => (total += f[field]));

    return total;
  }
}
