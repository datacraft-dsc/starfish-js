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

export interface IProvenanceOwnerList extends Array<IProvenanceOwner> {}

export interface IProvenanceOwner {
    assetId: string
    didId: string
}
