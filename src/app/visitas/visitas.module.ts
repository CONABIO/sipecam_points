import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { VisitasComponent } from './visitas.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, IonicModule],
  declarations: [VisitasComponent],
})
export class VisitasModule {}