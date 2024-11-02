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
    return this.http.get<IOpportunityFactoryResponse>(baseUrl + "opportunity")
  }
  
  addChild(parentId: number, childId: number): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.patch<any>(baseUrl + `opportunity/${parentId}/add/${childId}`, {})
  }

  getChildren(): Observable<IOpportunityChildrenResponse> {
    const baseUrl = this.getUrl()
    return this.http.get<IOpportunityChildrenResponse>(baseUrl + "opportunity/children")
  }

  removeChildFromParent(childId: number): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.patch<any>(baseUrl + `opportunity/children/${childId}`, {})
  }

  setPreferedOpportunity(pk: number, value: boolean): Observable<any> {
    const baseUrl = this.getUrl()
    return this.http.patch<any>(baseUrl + `opportunity/${pk}`, {value: value})
  }

  getMarkets(): Observable<IMarketResponse> {
    const baseUrl = this.getUrl()
    return this.http.get<IMarketResponse>(baseUrl + `market`)
  }

  addMarket(name: string, sbid: number): Observable<IMarketResponse> {
    const baseUrl = this.getUrl()
    return this.http.put<IMarketResponse>(baseUrl + `market`, {name: name, sbid: sbid})
  }

  removeMarket(pk: number): Observable<IMarketResponse> {
    const baseUrl = this.getUrl()
    return this.http.delete<IMarketResponse>(baseUrl + `market/${pk}`)
  }

  private getUrl(): string {
    return "http://127.0.0.1:8000/database/"
  }
}
 