export interface IOpportunityLinkResponseDict {
    data: IOpportunityLinkResponse[]
}

export interface IOpportunityLinkResponse {
    opportunity_link_id: number
    opportunities: IOpportunity[]
}
export interface IOpportunity {
    sportsbook: string
    opp_description: string   
    tip_type: string   
    opp_number: string   
    market_id: string   
    bet_order: number   
    sport: string 
}
