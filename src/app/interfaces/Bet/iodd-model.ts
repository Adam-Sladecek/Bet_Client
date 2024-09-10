export interface IOddModel {
    id: number
    odd_id: number
    code: number
    movement: number
    odd: number
    is_default: boolean
    selected: boolean
    locked: boolean
    event_id: number
    sportsbook_id: number
    description: string
    market_id: string
    kelly ?: number
}

export interface IOddResponse { 
    odds: IOddModel[]
}
