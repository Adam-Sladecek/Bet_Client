import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityDialogComponent } from './opportunity-dialog.component';

describe('OpportunityDialogComponent', () => {
  let component: OpportunityDialogComponent;
  let fixture: ComponentFixture<OpportunityDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpportunityDialogComponent]
    });
    fixture = TestBed.createComponent(OpportunityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
