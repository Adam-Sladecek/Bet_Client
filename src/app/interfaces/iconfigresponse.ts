export interface IConfigResponse {
    sports: IConfig[]
    sportsbooks: IConfig[]
}
export interface IConfig {
    id: number;
    name: string;
    selected: boolean
}