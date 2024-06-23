import { IOpportunity } from "./iopportunity";
import { IParentOpportunity } from "./iparrent-opportunity";

export interface IOpportunityFactoryResponse {
    parents: IParentOpportunity[] 
    opportunities: IOpportunity[] 
}



