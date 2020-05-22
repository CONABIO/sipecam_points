import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NodeDetailComponent } from './node-detail/node-detail.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, CoreModule, SharedModule, IonicModule, HomeRoutingModule],
  declarations: [HomeComponent, NodeDetailComponent],
  entryComponents: [NodeDetailComponent],
})
export class HomeModule {}
