import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes(
    [
      { path: 'quienes-somos', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule) },
      { path: 'zendro', loadChildren: () => import('./zendro/zendro.module').then((m) => m.ZendroModule) },
    ],
    false
  ),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
