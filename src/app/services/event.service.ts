import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEventResponse } from '../interfaces/Event/ievent-response';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getDefaultEvents(): Observable<IEventResponse> {
    const baseUrl = this.getUrl()
    return this.http.get<IEventResponse>(baseUrl + "event")
  }
  private getUrl(): string {
    return "http://127.0.0.1:8000/database/"
  }
}
