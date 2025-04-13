import { IMarket } from "./imarket"

export interface IMarketResponse {
    markets: {
        [key: number]: IMarket[]
    }
}
