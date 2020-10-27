import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { SitiosRoutingModule } from './sitios-routing.module';
import { SitiosComponent } from './sitios.component';
import { AddCumuloComponent } from '../sitios/add-cumulo/add-cumulo.component';
import { UploadFileComponent } from './upload-file/upload-file.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, IonicModule, SitiosRoutingModule],
  declarations: [SitiosComponent, AddCumuloComponent, UploadFileComponent],
  entryComponents: [AddCumuloComponent],
})
export class SitiosModule {}
