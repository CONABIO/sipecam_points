import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LightgalleryModule } from 'lightgallery/angular';

import { MultimediaRoutingModule } from './multimedia-routing.module';
import { MultimediaComponent } from './multimedia.component';
import { GaleriaComponent } from './galeria/galeria.component';
import { TableroParticularComponent } from './tablero-particular/tablero-particular.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    MultimediaRoutingModule,
    NgApexchartsModule,
    LightgalleryModule,
  ],
  declarations: [MultimediaComponent, GaleriaComponent, TableroParticularComponent],
})
export class MultimediaModule {}
