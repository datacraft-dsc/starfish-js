/*
 *
 *
 *      Data Asset Class
 *
 *
 */

import { IMetadata, IMetadataData } from '../Interfaces/Metadata'
import { AssetBase } from './AssetBase'
import { calcAssetDataHash } from '../Crypto'

export class DataAsset extends AssetBase {
    public data: Buffer

    public static create(name: string, data: Buffer, metadata?: string | IMetadataData, did?: string): DataAsset {
        const storeMetadata = AssetBase.generateMetadata(name, 'dataset', metadata)
        const asset = new DataAsset(storeMetadata, did, data)
        return asset
    }

    constructor(metadata: string | IMetadataData, did?: string, data?: Buffer) {
        super(<IMetadata>metadata, did)
        this.data = data
        this.metadata['contentHash'] = calcAssetDataHash(data)
    }
}
