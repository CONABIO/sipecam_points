import { Routes, Route } from '@angular/router';

import { AuthenticationGuard, AdminGuard, PartnerGuard } from '@app/auth';
import { ShellComponent } from './shell.component';

/**
 * Provides helper methods to create routes.
 */
export class Shell {
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static childRoutes(
    routes: Routes,
    canActivateEnabled: boolean = true,
    adminGuard: boolean = false,
    partnerGuard: boolean = false
  ): Route {
    const roleGuards = [];

    if (adminGuard) {
      roleGuards.push(AdminGuard);
    }

    if (partnerGuard) {
      roleGuards.push(PartnerGuard);
    }

    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: canActivateEnabled ? [AuthenticationGuard, ...roleGuards] : [],
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: false },
    };
  }
}
