import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/i18n';
import { SitiosComponent } from './sitios.component';
import { NodosComponent } from './nodos/nodos.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/sitios', pathMatch: 'full' },
    {
      path: 'sitios',
      component: SitiosComponent,
      data: { title: extract('Sitios') },
      children: [{ path: 'nodos', component: NodosComponent, data: { title: extract('Nodos SiPeCaM') } }],
    },
  ]),
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SitiosRoutingModule {}
