import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { EntregasRoutingModule } from './entregas-routing.module';
import { EntregasComponent } from './entregas.component';

@NgModule({
  imports: [CommonModule, TranslateModule, IonicModule, EntregasRoutingModule],
  declarations: [EntregasComponent],
})
export class EntregasModule {}
