export interface IEventModel {
    id: number
    time: string
    description: string
    selected: boolean
    sport_id: number
    sportsbook_id: number
    available_sportsbook_ids: number[]
    num_prices: number
}
