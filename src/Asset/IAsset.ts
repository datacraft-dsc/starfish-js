/*
 *
 *
 *
 *      Asset Interface
 *
 *
 *
 */

import { IMetaData } from './IMetaData'

export interface IAsset {
    did: string
    metadata: IMetaData
    metadataText: string
}

export interface IAssetList {
    [assetId: string]: IAsset
}
