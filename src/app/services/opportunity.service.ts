import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOpportunityFactoryResponse } from '../interfaces/Opportunity/iopportunity-factory-response';
import { IOpportunityChildrenResponse } from '../interfaces/Opportunity/iopportunity-children-response';
import { IMarketResponse } from '../interfaces/Opportunity/imarket-response';
import { API_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  constructor(private http: HttpClient) { }

  getOpportunitiesToLink(): Observable<IOpportunityFactoryResponse> {
    return this.http.get<IOpportunityFactoryResponse>(API_CONSTANTS.BASE_URL + "opportunities")
  }
  
  addChild(parentId: number, childId: number): Observable<any> {
    return this.http.patch<any>(API_CONSTANTS.BASE_URL + `opportunities/${parentId}/children/${childId}`, {})
  }

  getChildren(): Observable<IOpportunityChildrenResponse> {
    return this.http.get<IOpportunityChildrenResponse>(API_CONSTANTS.BASE_URL + "opportunities/children")
  }

  removeChildFromParent(childId: number): Observable<any> {
    return this.http.patch<any>(API_CONSTANTS.BASE_URL + `opportunities/${childId}/children`, {})
  }

  setPreferedOpportunity(pk: number, value: boolean): Observable<any> {
    return this.http.patch<any>(API_CONSTANTS.BASE_URL + `opportunities/${pk}`, {value: value})
  }

  getMarkets(): Observable<IMarketResponse> {
    return this.http.get<IMarketResponse>(API_CONSTANTS.BASE_URL + `markets`)
  }

  addMarket(name: string, sbid: number): Observable<IMarketResponse> {
    return this.http.put<IMarketResponse>(API_CONSTANTS.BASE_URL + `markets`, {name: name, sbid: sbid})
  }

  removeMarket(pk: number): Observable<IMarketResponse> {
    return this.http.delete<IMarketResponse>(API_CONSTANTS.BASE_URL + `markets/${pk}`)
  }
}
 