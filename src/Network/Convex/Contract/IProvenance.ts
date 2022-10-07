/*
    IProvenanceDataResult
*/

export interface IProvenanceDataList {
    [didId: string]: IProvenanceData
}
export interface IProvenanceData {
    timestamp: string
    owner: BigInt
    data: string
}

export type IProvenanceOwnerList = Array<IProvenanceOwner>

export interface IProvenanceOwner {
    assetId: string
    didId: string
}
