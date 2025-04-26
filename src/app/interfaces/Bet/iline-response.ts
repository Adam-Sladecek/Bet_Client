export interface ILineResponse {
    lines: ILine[]
    update_all: boolean
    selected_event_ids: number[]
}

export interface ILine {
    id: number
    default_event_id: number
    regular_event_id: number
    match_name: string
    opp_description: string
    parent: ILinePrice
    child: ILinePrice
    sport_id: number
    sportsbook_id: number
    ev: number
    stake: number
}

export interface ILinePrice {
    odds: number
    locked: boolean
    movement: number
}
