import { IOpportunity } from "./iopportunity";

export interface IOpportunityChildrenResponse {
    opportunities: IOpportunityWithParentName[]
}

export interface IOpportunityWithParentName { 
    parent_name: string
    opportunity: IOpportunity
}
