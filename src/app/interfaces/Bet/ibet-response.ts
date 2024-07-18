import { SocketResponseType } from "src/app/enums/socket-response-type";

export interface IBetResponse {
    type: SocketResponseType
    data: any
}
