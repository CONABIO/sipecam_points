import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { CumulosRoutingModule } from './cumulos-routing.module';
import { CumulosComponent } from './cumulos.component';

@NgModule({
  imports: [CommonModule, TranslateModule, IonicModule, CumulosRoutingModule],
  declarations: [CumulosComponent],
})
export class CumulosModule {}
