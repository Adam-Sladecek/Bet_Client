import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBet } from '../interfaces/ibet';
import { IBetResult } from '../interfaces/ibet-result';


@Injectable({
  providedIn: 'root'
})
export class LivebetService {
  _hiddenBets: IBet[]
  // baseUrl: string = "http://127.0.0.1:5000/"
  baseUrl: string = "https://6d9d-213-81-225-137.ngrok-free.app/"
  
  constructor( private http: HttpClient) {
    this._hiddenBets = []
   }
  
  public get hiddenBets() {
    return this._hiddenBets
  }
  getBets(): Observable<IBetResult> {
    return this.http.get<IBetResult>(this.baseUrl + "getBets", {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
  }
  
}
