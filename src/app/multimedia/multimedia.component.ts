import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.scss'],
})
export class MultimediaComponent implements OnInit {
  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {}
}
