import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { CumulosRoutingModule } from './cumulos-routing.module';
import { CumulosComponent } from './cumulos.component';
import { AddCumuloComponent } from '../cumulos/add-cumulo/add-cumulo.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, IonicModule, CumulosRoutingModule],
  declarations: [CumulosComponent, AddCumuloComponent],
  entryComponents: [AddCumuloComponent],
})
export class CumulosModule {}
