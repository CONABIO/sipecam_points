import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnInit {
  text: string;

  constructor(private popoverController: PopoverController) {}

  dismiss() {
    this.popoverController.dismiss();
  }

  ngOnInit(): void {}
}
