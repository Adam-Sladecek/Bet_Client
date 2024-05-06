import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpportunityLinksComponent } from './opportunity-links.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OpportunityService } from 'src/app/services/opportunity.service';
import { Observable } from 'rxjs';
import { IOpportunity, IOpportunityLinkResponse, IOpportunityLinkResponseDict } from 'src/app/interfaces/iopportunity-link-response-dict';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

describe('OpportunityLinksComponent', () => {
  let component: OpportunityLinksComponent;
  let fixture: ComponentFixture<OpportunityLinksComponent>;
  let opportunity_link_response_dict: IOpportunityLinkResponseDict

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        HttpClientTestingModule,
        ProgressSpinnerModule,
        FormsModule,
        TableModule,
        ToastModule 
      ],
      declarations: [OpportunityLinksComponent],
      providers: [OpportunityService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    opportunity_link_response_dict = {
      data: [
        {
          opportunity_link_id: 1,
          opportunities: [
            {} as IOpportunity
          ]
        } as IOpportunityLinkResponse
      ]
    } as IOpportunityLinkResponseDict;
  });

  // function tests

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn<any>(component, 'getLinks');
    expect(component.loading).toBeTrue();
    expect(component.deleting).toBeFalse();
    expect(component.opportunityLinks).toEqual([]);
    component.ngOnInit();
    expect(component['getLinks']).toHaveBeenCalled();
  })

  it('should get Opportunity links', () => {
    spyOn<any>(component['oppService'], 'getOpportunityLinks').and.returnValue(new Observable(subscriber => {
      expect(component.loading).toBeTrue();
      subscriber.next(opportunity_link_response_dict);
    }));
  
    component['getLinks']();

    expect(component['oppService'].getOpportunityLinks).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.opportunityLinks).toEqual(opportunity_link_response_dict.data);
  })

  it('should delete Opportunity link', () => {
    component.opportunityLinks = opportunity_link_response_dict.data
    const response = {message: 'Opportunity link deleted.'};
    spyOn<any>(component['oppService'], 'deleteOpportunityLink').and.returnValue(new Observable(subscriber => {
      expect(component.deleting).toBeTrue();
      expect(component.opportunityLinks.length).toEqual(1);
      subscriber.next(response);
    }));
  
    spyOn(component['messageService'], 'add');
    component['deleteLink'](opportunity_link_response_dict.data[0]);

    expect(component.opportunityLinks.length).toEqual(0);
    expect(component['messageService'].add).toHaveBeenCalledOnceWith({ severity: 'success', summary: 'Success', detail: response.message });
    expect(component.deleting).toBeFalse();
  })
});
