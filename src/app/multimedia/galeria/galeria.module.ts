import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { NgApexchartsModule } from 'ng-apexcharts';

import { GaleriaComponent } from './galeria.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgApexchartsModule, TranslateModule, IonicModule],
  declarations: [GaleriaComponent],
})
export class GaleriaModule {}
