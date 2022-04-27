import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { NgApexchartsModule } from 'ng-apexcharts';

import { EstadisticasRoutingModule } from './estadisticas-routing.module';
import { EstadisticasComponent } from './estadisticas.component';
import { TableroGeneralComponent } from './tablero-general/tablero-general.component';
import { TableroParticularComponent } from './tablero-particular/tablero-particular.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    EstadisticasRoutingModule,
    NgApexchartsModule,
  ],
  declarations: [EstadisticasComponent, TableroGeneralComponent, TableroParticularComponent],
})
export class EstadisticasModule {}
