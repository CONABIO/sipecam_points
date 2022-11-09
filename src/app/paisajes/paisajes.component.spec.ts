import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { PaisajesComponent } from './paisajes.component';

describe('PaisajesComponent', () => {
  let component: PaisajesComponent;
  let fixture: ComponentFixture<PaisajesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [IonicModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [PaisajesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PaisajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
