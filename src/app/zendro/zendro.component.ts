import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-zendro',
  templateUrl: './zendro.component.html',
  styleUrls: ['./zendro.component.scss'],
})
export class ZendroComponent implements OnInit {
  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {}

  openURL() {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://sipecamdata.conabio.gob.mx/zendro/');
  }
}
