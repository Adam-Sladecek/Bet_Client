import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketResponseType } from '../enums/socket-response-type';
import { TaskState } from '../enums/task-state';
import { IBet } from '../interfaces/ibet';
import { IError } from '../interfaces/ierror';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket !: WebSocket;
  private serverUrl: string
  private triggerEventSubject: Subject<void>
  private _triggerEvent$: Observable<void>
  private _state !: TaskState;
  private _error !: IError;
  private _bets: IBet[];
  private _hiddenBets: IBet[]
  
  constructor() {
    this._hiddenBets = []
    this._bets = []
    this.triggerEventSubject = new Subject<void>()
    this._triggerEvent$ = this.triggerEventSubject.asObservable()
    this.serverUrl = 'ws://localhost:8000/ws/scrape/'
    this.error = {'active': false, 'message': ''} as IError
    // "http://192.168.0.106:5000/"
  }
  
  // getUrl() {
  //   const urlSegment = localStorage.getItem('urlSegment') || ''; 
  //   return `https://${urlSegment}-213-81-225-137.ngrok-free.app/`
  // }

  get hiddenBets() {
    return this._hiddenBets
  }
  
  set hiddenBets(_value:IBet[] ) {
    this._hiddenBets = _value
  }

  get state(): TaskState  {
    return this._state;
  }

  set state(_value: TaskState) {
    this._state = _value;
  }

  get error(): IError  {
    return this._error;
  }
  
  set error(_value: IError)  {
    this._error = _value;
  }

  get bets(): IBet[]  {
    return this._bets;
  }

  set bets(_value: IBet[])  {
    this._bets = _value;
  }

  get triggerEventObservable() {
    return this._triggerEvent$;
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
        this.updateStates()
        return
      }
      else if (response["type"] as number == SocketResponseType.ERROR) {
        this._error = {'active': true, 'message': response["data"]} as IError
        console.log('Error:', event.data);
        this.updateStates();
        return
      }
    };

    this.socket.onclose = () => {
      this._error = {'active': true, 'message': 'WebSocket connection closed.'} as IError
      console.log('WebSocket connection closed.');
      this.updateStates();
    };
  }

  sendMessage(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket connection not open.');
    }
  }

  private updateStates(): void {
    this.triggerEventSubject.next();
  }
  
  private deserializeArbitrageBets(jsonData: any): IBet[] {
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
