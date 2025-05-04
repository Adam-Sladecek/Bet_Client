import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEventResponse } from '../interfaces/Event/ievent-response';
import { API_CONSTANTS } from '../constants/app.constants';
import { IPriceResponse } from '../interfaces/Bet/iprice-model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private sbRoutes: {[key: number]: string} = {
    1 : "assets/layout/images/sportsbooks/nike.png",
    2 : "assets/layout/images/sportsbooks/tipsport.png",
    3 : "assets/layout/images/sportsbooks/betfair.png",
    4 : "assets/layout/images/sportsbooks/fortuna.jpg",
    5 : "assets/layout/images/sportsbooks/ps3838.png",
    6 : "assets/layout/images/sportsbooks/pinnacle.png",
    7 : "assets/layout/images/sportsbooks/tipos.png",
    8 : "assets/layout/images/sportsbooks/doxxbet.png"
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
    5 : "PS3838",
    6 : "Betfair",
    7 : "Tipos",
    8 : "Doxxbet"
  }

  constructor(private http: HttpClient) { }

  getDefaultEvents(): Observable<IEventResponse> {
    return this.http.get<IEventResponse>(API_CONSTANTS.BASE_URL + "event/")
  }

  setDefaultEvents(ids: number[]): Observable<any> {
    return this.http.post<any>(API_CONSTANTS.BASE_URL + "event/", {eventIds: ids})
  }

  setUsedEvent(event_pk: number, sb_id: number): Observable<any> {
    return this.http.post<any>(API_CONSTANTS.BASE_URL + `event/${event_pk}/sportsbook/${sb_id}/`, {})
  }

  getEventPrices(event_pk: number): Observable<IPriceResponse> {
    return this.http.get<IPriceResponse>(API_CONSTANTS.BASE_URL + `event/${event_pk}/prices/`)
  }

  setEventPrices(event_pk: number, ids: number []): Observable<any> {
    return this.http.post<any>(API_CONSTANTS.BASE_URL + `event/${event_pk}/prices/`, {priceIds: ids})
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
