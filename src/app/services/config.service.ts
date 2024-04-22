import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketResponseType } from '../interfaces/socket-response-type';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  userLoggedIn: boolean
  constructor( private http: HttpClient ) {
    this.userLoggedIn = localStorage.getItem('loggedIn') == 'true' || false; 
  }
  getUrl() {
    // const urlSegment = localStorage.getItem('urlSegment') || ''; 
    // return `https://${urlSegment}-213-81-225-137.ngrok-free.app/`
    return "http://127.0.0.1:8000/database/"
  }
  getConfig(): Observable<any> {
    const baseUrl = this.getUrl()
    // return this.http.get<any>(baseUrl + "config/get", {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
    return this.http.get<any>(baseUrl + "config/get")
  }
  // getToken(): Observable<any> {
  //   const baseUrl = this.getUrl()
  //   return this.http.get<any>(baseUrl + "config/token")
  // }
  setConfig(body: any, headers: any): Observable<any> {
    const baseUrl = this.getUrl()
    // return this.http.post<any>(baseUrl + "config/set", body , {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
    return this.http.post<any>(baseUrl + "config/set", body, {headers})
  }
  login(body: any): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.post<any>(baseUrl + "login", body , {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
  }
}
