/*
 *
 *
 *      Data Asset Class
 *
 *
 */

import fs from 'fs-extra'
import mime from 'mime-types'

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

    public static async createFromFile(
        name: string,
        filename: string,
        metadata?: string | IMetadataData,
        did?: string
    ): Promise<DataAsset> {
        const storeMetadata = AssetBase.generateMetadata(name, 'dataset', metadata)
        const data = await fs.readFile(filename)
        storeMetadata['contentType'] = 'application/octet-stream'
        const mimeType = mime.lookup(filename)
        if (mimeType) {
            storeMetadata['contentType'] = mimeType
        }
        const asset = new DataAsset(storeMetadata, did, data)
        return asset
    }

    constructor(metadata: string | IMetadataData, did?: string, data?: Buffer) {
        super(<IMetadata>metadata, did)
        this.data = data
        this.metadata['contentHash'] = calcAssetDataHash(data)
    }

    public async saveToFile(filename: string): Promise<void> {
        fs.writeFile(filename, this.data)
    }
}
