import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/i18n';
import { SociosComponent } from './socios.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/socios', pathMatch: 'full' },
    { path: 'socios', component: SociosComponent, data: { title: extract('Socios') } },
  ]),
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SociosRoutingModule {}
