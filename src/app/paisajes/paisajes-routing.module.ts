import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/i18n';
import { PaisajesComponent } from './paisajes.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes(
    [{ path: 'paisajes/:id', component: PaisajesComponent, data: { title: extract('Paisajes') } }],
    true,
    false,
    true
  ),
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PaisajesRoutingModule {}
