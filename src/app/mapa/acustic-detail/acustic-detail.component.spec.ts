import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { AcusticDetailComponent } from './acustic-detail.component';

describe('AcusticDetailComponent', () => {
  let component: AcusticDetailComponent;
  let fixture: ComponentFixture<AcusticDetailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [IonicModule.forRoot(), CoreModule, SharedModule, HttpClientTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [AcusticDetailComponent],
        providers: [],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AcusticDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
