import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpportunityFactoryComponent } from './opportunity-factory.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OpportunityService } from 'src/app/services/opportunity.service';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { IOpportunityFactoryResponse } from 'src/app/interfaces/iopportunity-factory-response';
import { IOpportunity } from 'src/app/interfaces/iopportunity';
import { IParentOpportunity } from 'src/app/interfaces/iparrent-opportunity';

describe('OpportunityFactoryComponent', () => {
  let component: OpportunityFactoryComponent;
  let fixture: ComponentFixture<OpportunityFactoryComponent>;
  let opportunities: IOpportunityFactoryResponse

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        HttpClientTestingModule,
        ProgressSpinnerModule,
        DropdownModule,
        FormsModule,
        ToastModule
      ],
      declarations: [OpportunityFactoryComponent],
      providers: [OpportunityService, MessageService]
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

  // function tests

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn<any>(component, 'getOpportunities');
    expect(component.loading).toEqual(true);
    expect(component.linking).toEqual(false);
    expect(component.firstSelectedOpp).toEqual([]);
    expect(component.secondSelectedOpp).toEqual([]);
    component.ngOnInit();
    expect(component['getOpportunities']).toHaveBeenCalled();
  })

  it('should pick Opps', () => {
    var parent = {} as IParentOpportunity
    var opp = {} as IOpportunity
    component.pickParent(parent);
    expect(component.firstSelectedOpp).toEqual([parent]);
    expect(component.secondSelectedOpp).toEqual([]);
    component.pickOpportunity(opp);
    expect(component.secondSelectedOpp).toEqual([opp]);
  })

  it('should get Opportunities', () => {
    spyOn<any>(component['oppService'], 'getOpportunitiesToLink').and.returnValue(new Observable(subscriber => {
      expect(component.loading).toBeTrue();
      subscriber.next(opportunities);
    }));
  
    component['getOpportunities']();

    expect(component['oppService'].getOpportunitiesToLink).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.parents).toEqual(opportunities.parents);
    expect(component.opportunities).toEqual(opportunities.opportunities);
  })
});
