import { IMarket } from "./imarket"

export interface ISbWithMarkets {
    sportsbook_id: number
    new_market_name: string
    markets: IMarket[]
}
