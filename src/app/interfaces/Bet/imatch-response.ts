export interface IMatchOpportunityResponse {
    opportunities: IMatchOpportunity[]
    update_all: boolean
    match_ids: number[]
    odd_ids: number[]
}

export interface IMatchOpportunity {
    match_name: string
    opp_name: string
    match_id: number
    time: string
    parent: IMatchOdd
    child: IMatchOdd
    sport_id: number
    sportsbook_id: number
    ev: number
    stake: number
}

export interface IMatchOdd {
    odd_pk: number
    odds: number
    locked: boolean
    movement: number
}
