import { IOddModel } from "./iodd-model"

export interface IMatchOpportunityResponse {
    opportunities: IMatchOpportunity[]
    update_all: boolean
    match_ids: number[]
    sportsbook_ids: number[]
}

export interface IMatchOpportunity {
    name: string
    match_name: string
    match_id: number
    odd_id: number
    time: string
    sport_id: string
    odds: IOddModel[]
}
