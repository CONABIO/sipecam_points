import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { SociosRoutingModule } from './socios-routing.module';
import { SociosComponent } from './socios.component';
import { AddSocioComponent } from '../socios/add-socio/add-socio.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, IonicModule, SociosRoutingModule],
  declarations: [SociosComponent, AddSocioComponent],
  entryComponents: [AddSocioComponent],
})
export class SociosModule {}
