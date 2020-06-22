/*
 *
 *
 *
 *      Asset Interface
 *
 *
 *
 */

import { IMetadata } from './IMetadata'

export interface IAsset {
    did: string
    metadata: IMetadata
    metadataText: string
}

export interface IAssetList {
    [assetId: string]: IAsset
}
