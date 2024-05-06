import { TestBed } from '@angular/core/testing';

import { OpportunityService } from './opportunity.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IUnassignedOpportunityResponse } from '../interfaces/iunassigned-opportunity-response';
import { IUnassignedOpportunity } from '../interfaces/iunassigned-opportunity';
import { IOpportunity, IOpportunityLinkResponse, IOpportunityLinkResponseDict } from '../interfaces/iopportunity-link-response-dict';

describe('OpportunityService', () => {
  let service: OpportunityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [OpportunityService]
    });
    service = TestBed.inject(OpportunityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get opportunities', () => {
    const mockConfigResponse = {
      data: {'Nike': [
        {} as IUnassignedOpportunity
      ]}
    } as IUnassignedOpportunityResponse;
    service.getOpportunities().subscribe(response => {
      expect(response).toEqual(mockConfigResponse);
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'opportunitytolink/get');
    expect(req.request.method).toBe('GET');
    req.flush(mockConfigResponse);
  });

  it('should set opportunity link', () => {
    const mockConfigData = {
      sports: [
        {id:1, name: 'Tennis', selected: true}
      ],
      sportsBooks: [
        {id:1, name: 'Nike', selected: true}
      ]
    };
    service.setOpportunityLink(mockConfigData).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'opportunitylink/set');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockConfigData);
    req.flush({'message': 'Event link saved.'});
  });

  it('should get opportunity links', () => {
    const mockConfigResponse = {
      data: [
        {
          opportunity_link_id: 1,
          opportunities: [
            {} as IOpportunity
          ]
        } as IOpportunityLinkResponse
      ]
    } as IOpportunityLinkResponseDict;

    service.getOpportunityLinks().subscribe(response => {
      expect(response).toEqual(mockConfigResponse);
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'opportunitylink/get');
    expect(req.request.method).toBe('GET');
    req.flush(mockConfigResponse);
  });

  it('should delete opportunity link', () => {
    service.deleteOpportunityLink(1).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'opportunitylink/delete/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({'message': 'Opportunity link deleted.'});
  });
});
