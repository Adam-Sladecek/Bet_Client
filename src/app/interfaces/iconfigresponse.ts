export interface IConfigResponse {
    sports: IConfig[]
    sportsBooks: IConfig[]
}
export interface IConfig {
    id: number;
    name: string;
    selected: boolean
}