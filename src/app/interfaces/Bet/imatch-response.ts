import { IOddModel } from "./iodd-model"

export interface IMatchResponse {
    matches: IMatch[]
    sportsbook_ids: number[]
}

export interface IMatch {
    name: string
    match_id: number
    time: string
    sport_id: string
    opportunities: IMatchOpportunity[]
}

export interface IMatchOpportunity {
    name: string
    odds: IOddModel[]
}
