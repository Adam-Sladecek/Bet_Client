import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUnassignedOpportunityResponse } from '../interfaces/iunassigned-opportunity-response';
import { IOpportunityLinkResponseDict } from '../interfaces/iopportunity-link-response-dict';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  constructor(private http: HttpClient) { }

  getOpportunities(): Observable<IUnassignedOpportunityResponse> {
    const baseUrl = this.getUrl()
    return this.http.get<IUnassignedOpportunityResponse>(baseUrl + "opportunitytolink/get")
  }
  
  setOpportunityLink(body: any): Observable<any> {
    const baseUrl = this.getUrl()
    // return this.http.post<any>(baseUrl + "config/set", body , {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
    return this.http.post<any>(baseUrl + "opportunitylink/set", body)
  }
  
  getOpportunityLinks(): Observable<IOpportunityLinkResponseDict> {
    const baseUrl = this.getUrl()
    return this.http.get<IOpportunityLinkResponseDict>(baseUrl + "opportunitylink/get")
  }

  deleteOpportunityLink(linkId: number): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.delete<any>(baseUrl + `opportunitylink/delete/${linkId}`)
  }
  private getUrl(): string {
    return "http://127.0.0.1:8000/database/"
  }
}
