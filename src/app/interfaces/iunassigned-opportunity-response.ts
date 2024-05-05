import { IUnassignedOpportunity } from "./iunassigned-opportunity";

export interface IUnassignedOpportunityResponse {
    data: {[key: string]: IUnassignedOpportunity[]}
}
