export interface IMatchOpportunityResponse {
    opportunities: IMatchOpportunity[]
    update_all: boolean
    match_ids: number[]
    price_ids: number[]
}

export interface IMatchOpportunity {
    match_name: string
    opp_name: string
    match_id: number
    parent: IMatchPrice
    child: IMatchPrice
    sport_id: number
    sportsbook_id: number
    ev: number
    stake: number
}

export interface IMatchPrice {
    price_pk: number
    odds: number
    locked: boolean
    movement: number
}
