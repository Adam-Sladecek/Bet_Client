import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EventService } from './event.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [EventService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(EventService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
