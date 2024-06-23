import { IOpportunity } from "./iopportunity";
import { IParentOpportunity } from "./iparrent-opportunity";

export interface IOpportunityChildrenResponse {
    parents: IParentOpportunity[] 
    opportunities: ChildOpportunityDictionary
}

type ChildOpportunityDictionary = {
    [key: number]: IOpportunity[];
};
