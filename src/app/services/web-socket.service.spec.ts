import { TestBed } from '@angular/core/testing';

import { WebSocketService } from './web-socket.service';
import { IBet } from '../interfaces/ibet';
import { TaskState } from '../enums/task-state';
import { IError } from '../interfaces/ierror';

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

  it('should have default values set', () => {
    expect(webSocketService.hiddenBets).toEqual([]);
    expect(webSocketService.bets).toEqual([]);
    expect(webSocketService.state).toBeUndefined();
    expect(webSocketService.error).toEqual({ active: false, message: '' });
  });

  describe('privates', () => {
    it('should deserialize json ', () => {
      const bet = {
        id: 0,
        updated: '',
        first_odd_id: 0,
        second_odd_id: 0,
        sport_id: 0,
        sport_name: '',
        profit: 0,
        details: [{
          id: 0,
          player_name: '',
          sportsbook_name: '',
          opportunity_name: '',
          odd: 3,
          amount: 0
        },
        {
          id: 1,
          player_name: '',
          sportsbook_name: '',
          opportunity_name: '',
          odd: 2,
          amount: 0
        }]
      }
      var result = webSocketService['deserializeArbitrageBets']([bet])
      expect(result).toEqual([bet as IBet])
    });

    it('should update state', () => { 
      spyOn<any>(webSocketService['triggerEventSubject'], 'next');
      webSocketService['updateStates']()
      expect(webSocketService['triggerEventSubject'].next).toHaveBeenCalled()
    })
  });
  describe('connect()', () => {
    it('should establish WebSocket connection', () => {
      webSocketService.connect();
      expect(webSocketService['socket']).toBeTruthy()
      spyOn(console, 'log');
      (webSocketService['socket'] as any).onopen()
      expect(console.log).toHaveBeenCalled();
    });
    it('should handle close', () => {
      webSocketService.connect();
      expect(webSocketService['socket']).toBeTruthy()
      spyOn(console, 'log');
      spyOn<any>(webSocketService, 'updateStates');
      (webSocketService['socket'] as any).onclose()
      expect(webSocketService.error).toBeTruthy()
      expect(console.log).toHaveBeenCalled();
      expect(webSocketService['updateStates']).toHaveBeenCalled();
    });
    it('should handle message', () => {
      webSocketService.connect();
      expect(webSocketService['socket']).toBeTruthy()
      spyOn(console, 'log');
      spyOn<any>(webSocketService, 'updateStates');
      var jsonData = {
        type: 1,
        data: 1
      };
      var event = {data: JSON.stringify(jsonData)} as MessageEvent

      (webSocketService['socket'] as any).onmessage(event)
      expect(webSocketService.state).toBe(1 as TaskState)

      jsonData = {
        type: 3,
        data: 1
      };
      spyOn<any>(webSocketService, 'deserializeArbitrageBets');
      event = {data: JSON.stringify(jsonData)} as MessageEvent

      (webSocketService['socket'] as any).onmessage(event)
      expect(webSocketService['deserializeArbitrageBets']).toHaveBeenCalledOnceWith(jsonData.data);
      
      jsonData = {
        type: 2,
        data: 1
      };
      event = {data: JSON.stringify(jsonData)} as MessageEvent

      (webSocketService['socket'] as any).onmessage(event)
      expect(webSocketService['updateStates']).toHaveBeenCalledTimes(3);
      expect(webSocketService.error).toBeTruthy()
      expect(console.log).toHaveBeenCalledOnceWith('Error:', event.data);
    });
  });

  it('should send message', () => {
    webSocketService.connect();
    expect(webSocketService['socket']).toBeTruthy()
    spyOn(console, 'error');
    webSocketService.sendMessage({})
    expect(console.error).toHaveBeenCalled();
  });
});
