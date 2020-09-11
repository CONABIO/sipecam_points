import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { MapaRoutingModule } from './mapa-routing.module';
import { MapaComponent } from './mapa.component';
import { NodeDetailComponent } from './node-detail/node-detail.component';
import { FiltersComponent } from './filters/filters.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, CoreModule, SharedModule, IonicModule, MapaRoutingModule],
  declarations: [MapaComponent, NodeDetailComponent, FiltersComponent],
  entryComponents: [NodeDetailComponent],
})
export class MapaModule {}
