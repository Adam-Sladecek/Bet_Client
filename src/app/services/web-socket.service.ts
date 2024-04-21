import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketResponseType } from '../interfaces/socket-response-type';
import { TaskState } from '../interfaces/task-state';
import { IBet } from '../interfaces/ibet';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private serverUrl = 'ws://localhost:8000/ws/scrape/';
  // "http://192.168.0.106:5000/"
  private triggerEventSubject = new Subject<void>();
  triggerEvent$ = this.triggerEventSubject.asObservable();
  private _state!: TaskState;
  private _error!: boolean;
  private _bets: IBet[] = [];
  private _hiddenBets: IBet[]
  // getUrl() {
  //   const urlSegment = localStorage.getItem('urlSegment') || ''; 
  //   return `https://${urlSegment}-213-81-225-137.ngrok-free.app/`
  // }
  constructor() {
    this._hiddenBets = []
  }

  public get hiddenBets() {
    return this._hiddenBets
  }

  get state(): TaskState  {
    return this._state;
  }

  get error(): boolean  {
    return this._error;
  }

  get bets(): IBet[]  {
    return this._bets;
  }

  get triggerEventObservable() {
    return this.triggerEvent$;
  }

  connect(): void {
    this.socket = new WebSocket(this.serverUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onmessage = (event) => {
      let response = JSON.parse(event.data)
      if (response["type"] as number == SocketResponseType.STATERESPONSE) {
        this._state = response["data"] as TaskState;
        this.updateStates();
        return;
      }
      else if (response["type"] as number == SocketResponseType.MATCHDATA) {
        this._bets = this.deserializeArbitrageBets(response["data"]);
        this.updateStates();
        return
      }
      this._error = true;
      console.log('Error:', event.data);
      this.updateStates();
    };

    this.socket.onclose = () => {
      this._error = true;
      console.log('WebSocket connection closed.');
      this.updateStates();
    };
  }

  updateStates() {
    this.triggerEventSubject.next();
  }

  sendMessage(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket connection not open.');
    }
  }

  deserializeArbitrageBets(jsonData: any): IBet[] {
    return jsonData.map((bet: any) => ({
        id: bet.id,
        updated: bet.updated,
        first_odd_id: bet.first_odd_id,
        second_odd_id: bet.second_odd_id,
        sport_id: bet.sport_id,
        sport_name: bet.sport_name,
        profit: bet.profit,
        details: bet.details.map((detail: any) => ({
            id: detail.id,
            player_name: detail.player_name,
            sportsbook_name: detail.sportsbook_name,
            opportunity_name: detail.opportunity_name,
            odd: detail.odd,
            amount: detail.amount
        }))
    }));
}
}
