import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOpportunityFactoryResponse } from '../interfaces/iopportunity-factory-response';
import { IOpportunityChildrenResponse } from '../interfaces/iopportunity-children-response';
import { IOpportunityLinkResponse } from '../interfaces/iopportunity-link-response';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  constructor(private http: HttpClient) { }

  getOpportunitiesToLink(): Observable<IOpportunityFactoryResponse> {
    const baseUrl = this.getUrl()
    return this.http.get<IOpportunityFactoryResponse>(baseUrl + "opportunitytolink/get")
  }
  
  addOpportunityLink(body: any): Observable<IOpportunityFactoryResponse> {
    const baseUrl = this.getUrl()
    // return this.http.post<any>(baseUrl + "config/set", body , {headers: new HttpHeaders({'ngrok-skip-browser-warning': 'true'})})
    return this.http.post<IOpportunityFactoryResponse>(baseUrl + "opportunitylink/add", body)
  }
  
  addChild(parentId: number, childId: number): Observable<IOpportunityFactoryResponse> {
    const baseUrl = this.getUrl()
    return this.http.post<IOpportunityFactoryResponse>(baseUrl + `opportunity/${parentId}/add/${childId}`, {})
  }

  getChildren(): Observable<IOpportunityChildrenResponse> {
    const baseUrl = this.getUrl()
    return this.http.get<IOpportunityChildrenResponse>(baseUrl + "opportunity/children/get")
  }

  removeChildFromParent(childId: number): Observable<IOpportunityChildrenResponse> {
    const baseUrl = this.getUrl()
    return this.http.delete<IOpportunityChildrenResponse>(baseUrl + `opportunity/children/remove/${childId}`)
  }

  getLinks(): Observable<IOpportunityLinkResponse> {
    const baseUrl = this.getUrl()
    return this.http.get<IOpportunityLinkResponse>(baseUrl + "opportunitylink/get")
  }

  deleteLink(id: number): Observable<IOpportunityLinkResponse> {
    const baseUrl = this.getUrl()
    return this.http.delete<IOpportunityLinkResponse>(baseUrl + `opportunitylink/delete/${id}`)
  }

  private getUrl(): string {
    return "http://127.0.0.1:8000/database/"
  }
}
