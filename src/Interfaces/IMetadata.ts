/*

    Interfaces for Metadata

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
    inputs: any
    outputs: any
}

export interface IBundleContent {
    assetID: string
}

export interface IBundleMap {
    [name: string]: IBundleContent
}

export interface IMetadataBase {
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
    additionalInformation?: any
}

export interface IMetadataData extends IMetadataBase {
    // Data Asset
    size?: string
    contentType?: string
    encoding?: string
    compression?: string
    contentHash?: string
}

export interface IMetadataOperation extends IMetadataBase {
    // Opreation Asset
    operation?: IOperation
}

export interface IMetadataBundle extends IMetadataBase {
    // Bundle Asset
    contents?: IBundleMap
}

export interface IMetadata extends IMetadataData, IMetadataOperation, IMetadataBundle {}

export interface IMetadataList {
    [assetId: string]: IMetadata
}
