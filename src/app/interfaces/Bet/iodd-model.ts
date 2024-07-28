export interface IOddModel {
    id: number
    odd_id: number
    code: number
    odd: number
    is_default: boolean
    selected: boolean
    locked: boolean
    event_id: number
    sportsbook_id: number
    description: string
    parent_id: number
    market_id: string
}

export interface IOddResponse { 
    odds: IOddModel[]
}
