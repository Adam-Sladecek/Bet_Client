import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEventResponse } from '../interfaces/Event/ievent-response';
import { API_CONSTANTS } from '../constants/app.constants';
import { IOddResponse } from '../interfaces/Bet/iodd-model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getDefaultEvents(): Observable<IEventResponse> {
    return this.http.get<IEventResponse>(API_CONSTANTS.BASE_URL + "event")
  }

  setDefaultEvents(ids: number[]): Observable<IEventResponse> {
    return this.http.post<IEventResponse>(API_CONSTANTS.BASE_URL + "event/update", {ids: ids})
  }

  getEventOdds(event_id: number): Observable<IOddResponse> {
    return this.http.get<IOddResponse>(API_CONSTANTS.BASE_URL + `event/${event_id}/odds`)
  }

  setEventOdds(event_id: number, ids: number []): Observable<IOddResponse> {
    return this.http.post<IOddResponse>(API_CONSTANTS.BASE_URL + `event/${event_id}/odds/update`, {ids: ids})
  }

  getSbImageRoute(sbId: number): string {
    switch (sbId) {
      case 1:
        return "assets/layout/images/sportsbooks/nike.png"
      case 2:
        return "assets/layout/images/sportsbooks/tipsport.png"
      case 3:
        return "assets/layout/images/sportsbooks/fortuna.jpg"
      case 4:
        return "assets/layout/images/sportsbooks/tipos.png"
      case 5:
        return "assets/layout/images/sportsbooks/doxxbet.png"
      default:
        return ""
    }
  }

  getSportImageRoute(sportId: number): string {
    switch (sportId) {
      case 1:
        return "assets/layout/images/sports/football.png"
      case 2:
        return "assets/layout/images/sports/hockey.png"
      default:
        return ""
    }
  }
}
