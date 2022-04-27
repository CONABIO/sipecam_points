import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/i18n';
import { TableroGeneralComponent } from './tablero-general/tablero-general.component';
import { TableroParticularComponent } from './tablero-particular/tablero-particular.component';

const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  { path: ':id', component: TableroParticularComponent, data: { title: extract('Tablero particular') } },
  { path: '', component: TableroGeneralComponent, data: { title: extract('Tablero general') } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class EstadisticasRoutingModule {}
