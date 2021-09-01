import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { ZendroRoutingModule } from './zendro-routing.module';
import { ZendroComponent } from './zendro.component';

@NgModule({
  imports: [CommonModule, TranslateModule, IonicModule, ZendroRoutingModule],
  declarations: [ZendroComponent],
})
export class ZendroModule {}
