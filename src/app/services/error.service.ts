import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IErrorResult } from '../interfaces/ierrorresult';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor( private http: HttpClient ) { }

  getUrl() {
    // const urlSegment = localStorage.getItem('urlSegment') || ''; 
    // return `https://${urlSegment}-213-81-225-137.ngrok-free.app/`
    return "http://192.168.0.106:5000/"
  }
  
  getErrors():Observable<IErrorResult> {
    const baseUrl = this.getUrl()
    return this.http.get<IErrorResult>(baseUrl + "getErrors", {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
  }
}
