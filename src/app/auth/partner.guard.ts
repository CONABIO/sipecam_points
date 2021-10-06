import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Logger } from '@core';
import { CredentialsService } from './credentials.service';

const log = new Logger('PartnerGuard');

@Injectable({
  providedIn: 'root',
})
export class PartnerGuard implements CanActivate {
  constructor(private router: Router, private credentialsService: CredentialsService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (
      this.credentialsService.isAuthenticated() &&
      (this.credentialsService.isAdmin() || this.credentialsService.isPartner())
    ) {
      return true;
    }

    log.debug('Not allowed, redirecting and adding redirect url...');
    this.router.navigate(['/login'], { queryParams: { redirect: state.url }, replaceUrl: true });
    return false;
  }
}
