export interface IEventModel {
    id: number
    time: string
    description: string
    selected: boolean
    sport_id: number
    sportsbook_id: number
    available_sportsbooks: number[]
    price_count: number
}
