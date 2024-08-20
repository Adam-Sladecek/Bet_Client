import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';

import { OpportunityFactoryComponent } from '../opportunity-factory/opportunity-factory.component';
import { OpportunityManagementComponent } from './opportunity-management.component';
import { OpportunityChildrenComponent } from '../opportunity-children/opportunity-children.component';
import { OpportunityMarketsComponent } from '../opportunity-markets/opportunity-markets.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OpportunityManagementComponent', () => {
  let component: OpportunityManagementComponent;
  let fixture: ComponentFixture<OpportunityManagementComponent>;
  
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [
        OpportunityManagementComponent,
        OpportunityFactoryComponent,
        OpportunityChildrenComponent,
        OpportunityMarketsComponent
    ],
    imports: [ProgressSpinnerModule,
        TabViewModule,
        DropdownModule,
        FormsModule,
        ToastModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.activeIndex).toEqual(0);
  });
});
