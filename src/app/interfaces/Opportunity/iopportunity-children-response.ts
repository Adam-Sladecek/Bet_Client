import { IOpportunity } from "./iopportunity";

export interface IOpportunityChildrenResponse {
    opportunities: IOpportunityWithParentName[]
}

export interface IOpportunityWithParentName { 
    parent_id: number
    parent_name: string
    parent_prefered: boolean
    sportsbook_id: number
    opportunity: IOpportunity
}
