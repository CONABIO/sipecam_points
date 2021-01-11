import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { SitiosRoutingModule } from './sitios-routing.module';
import { SitiosComponent } from './sitios.component';
import { NodosComponent } from './nodos/nodos.component';
import { CumulosComponent } from './cumulos/cumulos.component';
import { AddCumuloComponent } from '../sitios/add-cumulo/add-cumulo.component';
import { UploadFileComponent } from './upload-file/upload-file.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, IonicModule, SitiosRoutingModule],
  declarations: [SitiosComponent, NodosComponent, AddCumuloComponent, UploadFileComponent, CumulosComponent],
  entryComponents: [AddCumuloComponent],
})
export class SitiosModule {}
