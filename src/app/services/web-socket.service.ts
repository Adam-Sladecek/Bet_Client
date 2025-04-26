import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketResponseType } from '../enums/socket-response-type';
import { TaskState } from '../enums/task-state';
import { IBetResponse } from '../interfaces/Bet/ibet-response';
import { SOCKET_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket !: WebSocket;
  private triggerEventSubject: Subject<IBetResponse>
  private _triggerEvent$: Observable<IBetResponse>
  private defaultEventSubject: Subject<TaskState>
  private _defaultEvent$: Observable<TaskState>
  
  constructor() {
    this.triggerEventSubject = new Subject<IBetResponse>()
    this._triggerEvent$ = this.triggerEventSubject.asObservable()

    this.defaultEventSubject = new Subject<TaskState>()
    this._defaultEvent$ = this.defaultEventSubject.asObservable()
  }
  
  get triggerEventObservable() {
    return this._triggerEvent$;
  }

  get defaultEventObservable() {
    return this._defaultEvent$;
  }

  connect(): void {
    const token = localStorage.getItem('access_token');
    this.socket = new WebSocket(SOCKET_CONSTANTS.URL + `?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onmessage = (event) => {
      let response = JSON.parse(event.data) as IBetResponse
      if (response.type == SocketResponseType.IMPORT) {
        this.defaultEventSubject.next(response.data as TaskState);
        return
      }
      this.triggerEventSubject.next(response);
    };

    this.socket.onclose = () => {
      var error = 'WebSocket connection closed.'
      console.log(error);
      this.triggerEventSubject.error({message: error});
    };
  }

  disconnect(): void {
    this.socket.close();
  }

  sendMessage(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      var error = 'WebSocket connection not opened.'
      console.error(error);
      this.triggerEventSubject.error({message: error});
    }
  }
}
