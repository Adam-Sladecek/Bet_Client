import { TestBed } from '@angular/core/testing';
import { OpportunityService } from './opportunity.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OpportunityService', () => {
  let service: OpportunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [OpportunityService]
    });
    service = TestBed.inject(OpportunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
