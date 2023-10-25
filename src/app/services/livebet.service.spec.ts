import { TestBed } from '@angular/core/testing';

import { LivebetService } from './livebet.service';

describe('LivebetService', () => {
  let service: LivebetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivebetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
