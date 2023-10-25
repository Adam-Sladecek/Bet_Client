import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  userLoggedIn: boolean
  constructor( private http: HttpClient ) {
    this.userLoggedIn = localStorage.getItem('loggedIn') == 'true' || false; 
  }
  getUrl() {
    const urlSegment = localStorage.getItem('urlSegment') || ''; 
    return `https://${urlSegment}-213-81-225-137.ngrok-free.app/`
  }
  getConfig(): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.get<any>(baseUrl + "getConfig", {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
  }
  setConfig(body: any): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.post<any>(baseUrl + "setConfig", body , {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
  }
  login(body: any): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.post<any>(baseUrl + "login", body , {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
  }
}
