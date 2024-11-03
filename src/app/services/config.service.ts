import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IConfigResponse } from '../interfaces/Config/iconfig-response';
import { API_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor( private http: HttpClient ) {}

  getConfig(): Observable<IConfigResponse> {
    return this.http.get<IConfigResponse>(API_CONSTANTS.BASE_URL + "configs")
  }
  
  setConfig(body: any): Observable<IConfigResponse> {
    return this.http.post<IConfigResponse>(API_CONSTANTS.BASE_URL + "configs", body)
  }
}
