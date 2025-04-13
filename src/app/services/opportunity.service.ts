import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOpportunityFactoryResponse } from '../interfaces/Opportunity/iopportunity-factory-response';
import { IOpportunityChildrenResponse } from '../interfaces/Opportunity/iopportunity-children-response';
import { IMarketResponse } from '../interfaces/Opportunity/imarket-response';
import { API_CONSTANTS } from '../constants/app.constants';
import { IMarket } from '../interfaces/Opportunity/imarket';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  constructor(private http: HttpClient) { }

  getOpportunitiesToLink(): Observable<IOpportunityFactoryResponse> {
    return this.http.get<IOpportunityFactoryResponse>(API_CONSTANTS.BASE_URL + "opportunity/")
  }
  
  addChild(parentId: number, childId: number): Observable<any> {
    return this.http.patch<any>(API_CONSTANTS.BASE_URL + `opportunity/children/${childId}/`, {add_parent: true, parent_id: parentId})
  }

  getChildren(): Observable<IOpportunityChildrenResponse> {
    return this.http.get<IOpportunityChildrenResponse>(API_CONSTANTS.BASE_URL + "opportunity/children/")
  }

  removeChildFromParent(childId: number): Observable<any> {
    return this.http.patch<any>(API_CONSTANTS.BASE_URL + `opportunity/children/${childId}/`, {add_parent: false})
  }

  setPreferedOpportunity(pk: number, preferred: boolean): Observable<any> {
    return this.http.patch<any>(API_CONSTANTS.BASE_URL + `opportunity/${pk}/`, {preferred: preferred})
  }

  getMarkets(): Observable<IMarketResponse> {
    return this.http.get<IMarketResponse>(API_CONSTANTS.BASE_URL + `market/`)
  }

  addMarket(name: string, sbid: number): Observable<IMarket> {
    return this.http.post<IMarket>(API_CONSTANTS.BASE_URL + `market/`, {value: name, sportsbook_id: sbid})
  }

  removeMarket(pk: number): Observable<any> {
    return this.http.delete<any>(API_CONSTANTS.BASE_URL + `market/${pk}/`)
  }
}
 