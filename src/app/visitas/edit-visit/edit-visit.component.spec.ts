import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditVisitComponent } from './edit-visit.component';

describe('EditVisitComponent', () => {
  let component: EditVisitComponent;
  let fixture: ComponentFixture<EditVisitComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditVisitComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
