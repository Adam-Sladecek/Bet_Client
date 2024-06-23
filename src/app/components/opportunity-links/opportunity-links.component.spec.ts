import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpportunityLinksComponent } from './opportunity-links.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OpportunityService } from 'src/app/services/opportunity.service';
import { Observable } from 'rxjs';
import { IOpportunityLink, IOpportunityLinkResponse } from 'src/app/interfaces/iopportunity-link-response';
import { IParentOpportunity } from 'src/app/interfaces/iparrent-opportunity';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

describe('OpportunityLinksComponent', () => {
  let component: OpportunityLinksComponent;
  let fixture: ComponentFixture<OpportunityLinksComponent>;
  let opportunity_link_response: IOpportunityLinkResponse

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
    opportunity_link_response = {
      links: []
    } as IOpportunityLinkResponse;
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

  it('should get links', () => {
    spyOn<any>(component['oppService'], 'getLinks').and.returnValue(new Observable(subscriber => {
      expect(component.loading).toBeTrue();
      subscriber.next(opportunity_link_response);
    }));
  
    component['getLinks']();

    expect(component['oppService'].getLinks).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.opportunityLinks).toEqual(opportunity_link_response.links);
  })

  it('should delete link', () => {
    component.opportunityLinks = opportunity_link_response.links
    spyOn<any>(component['oppService'], 'deleteLink').and.returnValue(new Observable(subscriber => {
      expect(component.deleting).toBeTrue();
      subscriber.next(opportunity_link_response);
    }));
  
    spyOn(component['messageService'], 'add');
    component['deleteLink']({id:1} as IParentOpportunity);

    expect(component['messageService'].add).toHaveBeenCalledOnceWith({ severity: 'success', summary: 'Success', detail: 'Link deleted.' });
    expect(component.deleting).toBeFalse();
  })
});
