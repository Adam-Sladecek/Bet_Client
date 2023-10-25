import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBet } from '../interfaces/ibet';
import { IBetResult } from '../interfaces/ibet-result';

@Injectable({
  providedIn: 'root'
})

export class BetService{
  _hiddenBets: IBet[]
  constructor( private http: HttpClient) {
    this._hiddenBets = []
   }
  
  public get hiddenBets() {
    return this._hiddenBets
  }
  getUrl() {
    const urlSegment = localStorage.getItem('urlSegment') || ''; 
    return `https://${urlSegment}-213-81-225-137.ngrok-free.app/`
  }
  getBets(): Observable<IBetResult> {
    const baseUrl = this.getUrl()
    return this.http.get<IBetResult>(baseUrl + "getBets", {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
  }
  startScrape(): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.get<any>(baseUrl + "startScrape", {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
  }
  endScrape(): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.get<any>(baseUrl + "endScrape", {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
  }
  checkState(): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.get<any>(baseUrl + "checkRunningTask", {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
  }
}
