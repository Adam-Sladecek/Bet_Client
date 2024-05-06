import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpportunityFactoryComponent } from './opportunity-factory.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OpportunityService } from 'src/app/services/opportunity.service';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { IUnassignedOpportunity } from 'src/app/interfaces/iunassigned-opportunity';
import { IUnassignedOpportunityResponse } from 'src/app/interfaces/iunassigned-opportunity-response';
import { Observable } from 'rxjs';

describe('OpportunityFactoryComponent', () => {
  let component: OpportunityFactoryComponent;
  let fixture: ComponentFixture<OpportunityFactoryComponent>;
  let opportunities: IUnassignedOpportunityResponse

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
      data: {
        'Nike': [
          {opportunity_id: 1, sportsbook: 'Betfair', sport:'Tennis'} as IUnassignedOpportunity,
          {opportunity_id: 2, sportsbook: 'Tipsport', sport:'Tennis'} as IUnassignedOpportunity,
        ],
        'Tipsport': [
          {opportunity_id: 3, sportsbook: 'Betfair', sport:'Tennis'} as IUnassignedOpportunity,
          {opportunity_id: 4, sportsbook: 'Nike', sport:'Tennis'} as IUnassignedOpportunity,
          {opportunity_id: 5, sportsbook: 'Nike', sport:'Football'} as IUnassignedOpportunity,
        ]
      }
    } as IUnassignedOpportunityResponse
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

  it('should call sbChange', () => {
    component.allOpportunities = opportunities
    component.sbChange({value: 'Nike'} as DropdownChangeEvent);
    expect(component.firstSelectedOpp).toEqual([]);
    expect(component.secondSelectedOpp).toEqual([]);
    expect(component.firstOpportunities).toEqual([
      {opportunity_id: 1, sportsbook: 'Betfair', sport:'Tennis'} as IUnassignedOpportunity,
      {opportunity_id: 2, sportsbook: 'Tipsport', sport:'Tennis'} as IUnassignedOpportunity,
    ]);
    expect(component.secondOpportunities).toEqual([
      {opportunity_id: 4, sportsbook: 'Nike', sport:'Tennis'} as IUnassignedOpportunity,
      {opportunity_id: 5, sportsbook: 'Nike', sport:'Football'} as IUnassignedOpportunity,
    ]);
  })

  it('should pick Opps', () => {
    var opp = {opportunity_id: 1, sportsbook: 'Betfair'} as IUnassignedOpportunity
    component.pickFirstOpp(opp);
    expect(component.firstSelectedOpp).toEqual([opp]);
    expect(component.secondSelectedOpp).toEqual([]);
    component.pickSecondOpp(opp);
    expect(component.secondSelectedOpp).toEqual([opp]);
  })

  it('should get Opportunities', () => {
    spyOn<any>(component['oppService'], 'getOpportunities').and.returnValue(new Observable(subscriber => {
      expect(component.loading).toBeTrue();
      subscriber.next(opportunities);
    }));
  
    component['getOpportunities']();

    expect(component['oppService'].getOpportunities).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.allOpportunities).toEqual(opportunities);
    expect(component.allSportsBooks).toEqual(['Nike', 'Tipsport']);
  })

  it('should show second opps', () => {
    component.allOpportunities = opportunities
    component.firstSelectedOpp = []
    var opp = opportunities.data['Tipsport'][1]
    expect(component.showSecondOpp(opp)).toBeFalse();
    component.firstSelectedOpp = [opportunities.data['Nike'][1]]
    expect(component.showSecondOpp(opp)).toBeTrue();
    opp = opportunities.data['Nike'][0]
    expect(component.showSecondOpp(opp)).toBeFalse();
    opp = opportunities.data['Tipsport'][2]
    expect(component.showSecondOpp(opp)).toBeFalse();
  })

  it('should link', () => {
    component.allOpportunities = opportunities
    component.firstSelectedOpp = [opportunities.data['Nike'][1]]
    component.secondSelectedOpp = [opportunities.data['Tipsport'][1]]
    const response = {message: 'Opportunity link saved.'};
    const body = {opportunities: [component.firstSelectedOpp[0], component.secondSelectedOpp[0]]}
    spyOn(component['oppService'], 'setOpportunityLink').and.returnValue(new Observable(subscriber => {
      expect(component.linking).toBeTrue();
      subscriber.next(response);
    }));
    spyOn(component['messageService'], 'add');
    spyOn(component, 'sbChange');

    component.link();
    expect(component['oppService'].setOpportunityLink).toHaveBeenCalledWith(body);
    expect(component.allOpportunities).toEqual({
      data: {
        'Nike': [
          {opportunity_id: 1, sportsbook: 'Betfair', sport:'Tennis'} as IUnassignedOpportunity,
        ],
        'Tipsport': [
          {opportunity_id: 3, sportsbook: 'Betfair', sport:'Tennis'} as IUnassignedOpportunity,
          {opportunity_id: 5, sportsbook: 'Nike', sport:'Football'} as IUnassignedOpportunity,
        ]
      }
    } as IUnassignedOpportunityResponse)
    expect(component.sbChange).toHaveBeenCalledOnceWith({value: 'Nike'} as DropdownChangeEvent);
    expect(component['messageService'].add).toHaveBeenCalledOnceWith({ severity: 'success', summary: 'Success', detail: response.message });
    expect(component.linking).toBeFalse();
  })
});
