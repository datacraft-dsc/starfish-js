/*

    Interfaces for MetaData

*/

export interface ILink {
    name?: string
    type: string
    url?: string
    assetID?: string
}

export interface IOperation {
    class?: string
    modes?: Array<string>
    inputs: unknown
    outputs: unknown
}

export interface IBundleContent {
    assetID: string
}

export interface IBundleMap {
    [name: string]: IBundleContent
}

export interface IMetaDataBase {
    name?: string
    type?: string
    description?: string
    dateCreated?: string
    creator?: string
    license?: string
    copyrightHolder?: string
    links?: Array<ILink>
    inLanguage?: string
    tags?: Array<string>
    additionalInformation?: unknown
}

export interface IMetaDataData extends IMetaDataBase {
    // Data Asset
    size?: string
    contentType?: string
    encoding?: string
    compression?: string
    contentHash?: string
}

export interface IMetaDataOperation extends IMetaDataBase {
    // Opreation Asset
    operation?: IOperation
}

export interface IMetaDataBundle extends IMetaDataBase {
    // Bundle Asset
    contents?: IBundleMap
}

export interface IMetaData extends IMetaDataData, IMetaDataOperation, IMetaDataBundle {}

export interface IMetaDataList {
    [assetId: string]: IMetaData
}
