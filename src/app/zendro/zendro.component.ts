import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { environment } from '@env/environment';

@Component({
  selector: 'app-zendro',
  templateUrl: './zendro.component.html',
  styleUrls: ['./zendro.component.scss'],
})
export class ZendroComponent implements OnInit {
  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {}

  openURL() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(environment.zendroUrl);
  }
}
