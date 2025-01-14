export interface IPriceModel {
    id: number
    description: string
    selected: boolean
}

export interface IPriceResponse { 
    prices: IPriceModel[]
}