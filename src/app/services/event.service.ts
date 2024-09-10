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
  private sbRoutes: {[key: number]: string} = {
    1 : "assets/layout/images/sportsbooks/nike.png",
    2 : "assets/layout/images/sportsbooks/tipsport.png",
    3 : "assets/layout/images/sportsbooks/pinnacle.png",
    4 : "assets/layout/images/sportsbooks/fortuna.jpg",
    5 : "assets/layout/images/sportsbooks/tipos.png",
    6 : "assets/layout/images/sportsbooks/doxxbet.png"
  }

  private sportRoutes: {[key: number]: string} = {
    1 : "assets/layout/images/sports/football.png",
    2 : "assets/layout/images/sports/hockey.png",
    3 : "assets/layout/images/sports/tennis.png",
    4 : "assets/layout/images/sports/basketball.png",
    5 : "assets/layout/images/sports/handball.png",
    6 : "assets/layout/images/sports/volleyball.png",
    7 : "assets/layout/images/sports/tabletennis.png",
    8 : "assets/layout/images/sports/box.png"
  }

  private sbNames: {[key: number]: string} = {
    1 : "Nike",
    2 : "Tipsport",
    3 : "Pinnacle",
    4 : "Fortuna",
    5 : "Tipos",
    6 : "Doxxbet"
  }

  constructor(private http: HttpClient) { }

  getDefaultEvents(): Observable<IEventResponse> {
    return this.http.get<IEventResponse>(API_CONSTANTS.BASE_URL + "event")
  }

  setDefaultEvents(ids: number[]): Observable<any> {
    return this.http.post<any>(API_CONSTANTS.BASE_URL + "event/update", {ids: ids})
  }

  getEventOdds(event_id: number): Observable<IOddResponse> {
    return this.http.get<IOddResponse>(API_CONSTANTS.BASE_URL + `event/${event_id}/odds`)
  }

  setEventOdds(event_id: number, ids: number []): Observable<any> {
    return this.http.post<any>(API_CONSTANTS.BASE_URL + `event/${event_id}/odds/update`, {ids: ids})
  }

  getSbImageRoute(sbId: number): string {
    return this.sbRoutes[sbId] ?? ''
  }

  getSbName(sbId: number): string {
    return this.sbNames[sbId] ?? ''
  }

  getSportImageRoute(sportId: number): string {
    return this.sportRoutes[sportId] ?? ''
  }
}
