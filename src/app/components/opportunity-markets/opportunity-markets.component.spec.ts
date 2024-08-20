import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

import { OpportunityMarketsComponent } from './opportunity-markets.component';

describe('OpportunityMarketsComponent', () => {
  let component: OpportunityMarketsComponent;
  let fixture: ComponentFixture<OpportunityMarketsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        ProgressSpinnerModule,
        TableModule,
        ToastModule,
        HttpClientTestingModule
      ],
      declarations: [OpportunityMarketsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityMarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
