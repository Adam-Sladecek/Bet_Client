import { TestBed } from '@angular/core/testing';
import { OpportunityService } from './opportunity.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OpportunityService', () => {
  let service: OpportunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [OpportunityService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(OpportunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
