import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

import { OpportunityMarketsComponent } from './opportunity-markets.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OpportunityMarketsComponent', () => {
  let component: OpportunityMarketsComponent;
  let fixture: ComponentFixture<OpportunityMarketsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [OpportunityMarketsComponent],
    imports: [ProgressSpinnerModule,
        TableModule,
        ToastModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
