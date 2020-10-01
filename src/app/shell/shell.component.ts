import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { TextFieldTypes } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/auth/authentication.service';
import { CredentialsService } from '@app/auth/credentials.service';
import { I18nService } from '@app/i18n';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  isLoggedIn = false;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private platform: Platform,
    private alertController: AlertController,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private i18nService: I18nService
  ) {
    this.isLoggedIn = this.credentialsService.isAuthenticated();
  }

  get isWeb(): boolean {
    return !this.platform.is('cordova');
  }

  async changeLanguage() {
    const alertController = await this.alertController.create({
      header: this.translateService.instant('Change language'),
      inputs: this.i18nService.supportedLanguages.map((language) => ({
        type: 'radio' as TextFieldTypes,
        name: language,
        label: language,
        value: language,
        checked: language === this.i18nService.language,
      })),
      buttons: [
        {
          text: this.translateService.instant('Cancel'),
          role: 'cancel',
        },
        {
          text: this.translateService.instant('Ok'),
          handler: (language) => {
            this.i18nService.language = language;
          },
        },
      ],
    });
    await alertController.present();
  }

  login() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  logout() {
    this.authenticationService.logout().subscribe((success) => {
      if (success) {
        this.isLoggedIn = false;
        this.router.navigate(['/'], { replaceUrl: true });
      }
    });
  }
}
