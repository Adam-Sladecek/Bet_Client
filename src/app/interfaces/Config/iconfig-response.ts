import { IConfig } from "./iconfig"

export interface IConfigResponse {
    sports: IConfig[]
    sportsbooks: IConfig[]
    default_sportsbooks: IConfig[]
}
