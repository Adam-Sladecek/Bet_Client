import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor( private http: HttpClient ) {}

  getConfig(): Observable<any> {
    const baseUrl = this.getUrl()
    // return this.http.get<any>(baseUrl + "config/get", {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
    return this.http.get<any>(baseUrl + "config/get")
  }
  
  setConfig(body: any): Observable<any> {
    const baseUrl = this.getUrl()
    // return this.http.post<any>(baseUrl + "config/set", body , {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
    return this.http.post<any>(baseUrl + "config/set", body)
  }
  
  private getUrl(): string {
    // const urlSegment = localStorage.getItem('urlSegment') || ''; 
    // return `https://${urlSegment}-213-81-225-137.ngrok-free.app/`
    return "http://127.0.0.1:8000/database/"
  }

  // getToken(): Observable<any> {
  //   const baseUrl = this.getUrl()
  //   return this.http.get<any>(baseUrl + "config/token")
  // }

  // login(body: any): Observable<any> {
  //   const baseUrl = this.getUrl()
  //   return this.http.post<any>(baseUrl + "login", body , {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
  // }
}
