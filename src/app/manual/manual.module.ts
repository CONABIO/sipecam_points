import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { ManualRoutingModule } from './manual-routing.module';
import { ManualComponent } from './manual.component';

@NgModule({
  imports: [CommonModule, TranslateModule, IonicModule, ManualRoutingModule],
  declarations: [ManualComponent],
})
export class ManualModule {}
