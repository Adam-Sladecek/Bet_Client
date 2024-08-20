import { TestBed } from '@angular/core/testing';

import { WebSocketService } from './web-socket.service';

describe('WebSocketService', () => {
  let webSocketService: WebSocketService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketService]
    });
    webSocketService = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(webSocketService).toBeTruthy();
  });
});
