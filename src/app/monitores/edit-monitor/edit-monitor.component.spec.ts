import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { EditMonitorComponent } from './edit-monitor.component';

describe('EditMonitorComponent', () => {
  let component: EditMonitorComponent;
  let fixture: ComponentFixture<EditMonitorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [IonicModule.forRoot(), CoreModule, SharedModule, HttpClientTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [EditMonitorComponent],
        providers: [],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
