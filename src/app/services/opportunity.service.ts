import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOpportunityFactoryResponse } from '../interfaces/Opportunity/iopportunity-factory-response';
import { IOpportunityChildrenResponse } from '../interfaces/Opportunity/iopportunity-children-response';
import { IMarketResponse } from '../interfaces/Opportunity/imarket-response';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  constructor(private http: HttpClient) { }

  getOpportunitiesToLink(): Observable<IOpportunityFactoryResponse> {
    const baseUrl = this.getUrl()
    return this.http.get<IOpportunityFactoryResponse>(baseUrl + "opportunitytolink/get")
  }
  
  addChild(parentId: number, childId: number): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.patch<any>(baseUrl + `opportunity/${parentId}/add/${childId}`, {})
  }

  getChildren(): Observable<IOpportunityChildrenResponse> {
    const baseUrl = this.getUrl()
    return this.http.get<IOpportunityChildrenResponse>(baseUrl + "opportunity/children/get")
  }

  removeChildFromParent(childId: number): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.patch<any>(baseUrl + `opportunity/children/remove/${childId}`, {})
  }

  setPreferedOpportunity(pk: number, value: boolean): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.patch<any>(baseUrl + `opportunity/prefered/${pk}`, {value: value})
  }

  getMarkets(): Observable<IMarketResponse> {
    const baseUrl = this.getUrl()
    return this.http.get<IMarketResponse>(baseUrl + `market`)
  }

  addMarket(name: string, sbid: number): Observable<IMarketResponse> {
    const baseUrl = this.getUrl()
    return this.http.post<IMarketResponse>(baseUrl + `market/add`, {name: name, sbid: sbid})
  }

  removeMarket(pk: number): Observable<IMarketResponse> {
    const baseUrl = this.getUrl()
    return this.http.delete<IMarketResponse>(baseUrl + `market/remove/${pk}`)
  }

  private getUrl(): string {
    return "http://127.0.0.1:8000/database/"
  }
}
 