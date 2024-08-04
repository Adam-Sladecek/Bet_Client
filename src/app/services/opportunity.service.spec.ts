import { TestBed } from '@angular/core/testing';
import { OpportunityService } from './opportunity.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IOpportunityFactoryResponse } from '../interfaces/Opportunity/iopportunity-factory-response';
import { IOpportunityChildrenResponse } from '../interfaces/Opportunity/iopportunity-children-response';
import { IOpportunityLinkResponse } from '../interfaces/iopportunity-link-response';
import { IOpportunity } from '../interfaces/Opportunity/iopportunity';

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

  it('should get opportunities to link', () => {
    const mockFactoryResponse = {
      parents: [],
      opportunities: []
    } as IOpportunityFactoryResponse;
    service.getOpportunitiesToLink().subscribe(response => {
      expect(response).toEqual(mockFactoryResponse);
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'opportunitytolink/get');
    expect(req.request.method).toBe('GET');
    req.flush(mockFactoryResponse);
  });

  it('should add opportunity link', () => {
    const mockLinkData = {
      opportunities: [{} as IOpportunity, {} as IOpportunity]
    };
    const mockFactoryResponse = {
      parents: [],
      opportunities: []
    } as IOpportunityFactoryResponse;
    service.addOpportunityLink(mockLinkData).subscribe(response => {
      expect(response).toEqual(mockFactoryResponse);
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'opportunitylink/add');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLinkData);
    req.flush(mockFactoryResponse);
  });

  it('should add child', () => {
    const mockFactoryResponse = {
      parents: [],
      opportunities: []
    } as IOpportunityFactoryResponse;
    service.addChild(2, 3).subscribe(response => {
      expect(response).toEqual(mockFactoryResponse);
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'opportunity/2/add/3');
    expect(req.request.method).toBe('POST');
    req.flush(mockFactoryResponse);
  });

  it('should get children', () => {
    const mockChildrenResponse = {
      opportunities: []
    } as IOpportunityChildrenResponse;
    service.getChildren().subscribe(response => {
      expect(response).toEqual(mockChildrenResponse);
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'opportunity/children/get');
    expect(req.request.method).toBe('GET');
    req.flush(mockChildrenResponse);
  });

  it('should remove child from parent', () => {
    const mockChildrenResponse = {
      opportunities: []
    } as IOpportunityChildrenResponse;
    service.removeChildFromParent(5).subscribe(response => {
      expect(response).toEqual(mockChildrenResponse);
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'opportunity/children/remove/5');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockChildrenResponse);
  });

  it('should get links', () => {
    const mockLinkResponse = {
      links: []
    } as IOpportunityLinkResponse;

    service.getLinks().subscribe(response => {
      expect(response).toEqual(mockLinkResponse);
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'opportunitylink/get');
    expect(req.request.method).toBe('GET');
    req.flush(mockLinkResponse);
  });

  it('should delete link', () => {
    const mockLinkResponse = {
      links: []
    } as IOpportunityLinkResponse;
    service.deleteLink(1).subscribe(response => {
      expect(response).toEqual(mockLinkResponse);
    });
    const url = service['getUrl']()
    const req = httpMock.expectOne(url + 'opportunitylink/delete/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockLinkResponse);
  });
});
