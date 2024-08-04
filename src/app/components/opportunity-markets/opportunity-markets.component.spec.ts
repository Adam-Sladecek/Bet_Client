import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityMarketsComponent } from './opportunity-markets.component';

describe('OpportunityMarketsComponent', () => {
  let component: OpportunityMarketsComponent;
  let fixture: ComponentFixture<OpportunityMarketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpportunityMarketsComponent]
    });
    fixture = TestBed.createComponent(OpportunityMarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
