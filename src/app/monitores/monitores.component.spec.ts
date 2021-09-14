import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { MonitoresComponent } from './monitores.component';

describe('MonitoresComponent', () => {
  let component: MonitoresComponent;
  let fixture: ComponentFixture<MonitoresComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [IonicModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [MonitoresComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
