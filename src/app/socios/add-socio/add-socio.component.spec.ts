import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSocioComponent } from './add-socio.component';

describe('AddSocioComponent', () => {
  let component: AddSocioComponent;
  let fixture: ComponentFixture<AddSocioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSocioComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
