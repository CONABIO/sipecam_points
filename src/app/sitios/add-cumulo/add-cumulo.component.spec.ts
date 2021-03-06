import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCumuloComponent } from './add-cumulo.component';

describe('AddCumuloComponent', () => {
  let component: AddCumuloComponent;
  let fixture: ComponentFixture<AddCumuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCumuloComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCumuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
