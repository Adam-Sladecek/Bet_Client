import { IParentOpportunity } from "./iparrent-opportunity"

export interface IOpportunityLinkResponse {
    links: IOpportunityLink[]
}

export interface IOpportunityLink {
    sport: string
    parents: IParentOpportunity[]
}