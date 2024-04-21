export interface IBet {
    id: number;
    updated: string;
    first_odd_id: number;
    second_odd_id: number;
    sport_id: number;
    sport_name: string;
    profit: number;
    details: IBetDetail[];
}
interface IBetDetail {
    id: number;
    player_name: string;
    sportsbook_name: string;
    opportunity_name: string;
    odd: number;
    amount: number;
}

