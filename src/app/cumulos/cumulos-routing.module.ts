import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/i18n';
import { CumulosComponent } from './cumulos.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/cumulos', pathMatch: 'full' },
    { path: 'cumulos', component: CumulosComponent, data: { title: extract('Cúmulos') } },
  ]),
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class CumulosRoutingModule {}
