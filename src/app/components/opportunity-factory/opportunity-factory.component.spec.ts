import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { OpportunityFactoryComponent } from './opportunity-factory.component';
import { OpportunityService } from 'src/app/services/opportunity.service';
import { IOpportunityFactoryResponse } from 'src/app/interfaces/Opportunity/iopportunity-factory-response';
import { IOpportunity } from 'src/app/interfaces/Opportunity/iopportunity';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OpportunityFactoryComponent', () => {
  let component: OpportunityFactoryComponent;
  let fixture: ComponentFixture<OpportunityFactoryComponent>;
  let opportunities: IOpportunityFactoryResponse

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [OpportunityFactoryComponent],
    imports: [ProgressSpinnerModule,
        DropdownModule,
        FormsModule,
        ToastModule],
    providers: [OpportunityService, MessageService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    opportunities = {
      parents: [],
      opportunities: []
    } as IOpportunityFactoryResponse
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn<any>(component, 'getOpportunities');
    expect(component.loading).toEqual(true);
    expect(component.linking).toEqual(false);
    expect(component.selectedParent).toEqual([]);
    expect(component.selectedOpp).toEqual([]);
    component.ngOnInit();
    expect(component['getOpportunities']).toHaveBeenCalled();
  })

  it('should pick Opps', () => {
    var parent = {} as IOpportunity
    var opp = {} as IOpportunity
    component.pickParent(parent);
    expect(component.selectedParent).toEqual([parent]);
    expect(component.canLinkChild).toBeFalse();
    component.pickOpportunity(opp);
    expect(component.selectedOpp).toEqual([opp]);
    expect(component.canLinkChild).toBeTrue();
  })
});
