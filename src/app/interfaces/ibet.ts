export interface IBet {
    created: Date
    sport: string
    implProb: number
    sb1: string
    sb2: string
    sb3?: string
    player1: string
    playerX?: string
    player2: string
    c1?: number
    cX?: number
    c2?: number
    c1X?: number
    c2X?: number
    c12?: number
    bet1?: number
    betX?: number
    bet2?: number
    bet1X?: number
    bet2X?: number
    bet12?: number
    yield: number
    active: boolean
    identifier: string
    betIdentifier: string
}
