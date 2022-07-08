import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/i18n';
import { GaleriaComponent } from './galeria/galeria.component';
import { TableroParticularComponent } from './tablero-particular/tablero-particular.component';

const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  { path: ':id', component: GaleriaComponent, data: { title: extract('Galería multimedia') } },
  // { path: '', component: TableroGeneralComponent, data: { title: extract('Tablero general') } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class MultimediaRoutingModule {}
