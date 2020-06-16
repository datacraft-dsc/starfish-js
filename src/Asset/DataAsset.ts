/*
 *
 *
 *      Data Asset Class
 *
 *
 */

import fs from 'fs-extra'
import mime from 'mime-types'

import { IMetadata, IMetadataData } from 'starfish/Interfaces/Metadata'
import { AssetBase } from './AssetBase'
import { calcAssetDataHash } from 'starfish/Crypto'

export class DataAsset extends AssetBase {
    public data: Buffer

    public static create(name: string, data: Buffer, metadata?: string | IMetadataData, did?: string): DataAsset {
        const storeMetadata = AssetBase.generateMetadata(name, 'dataset', metadata)
        storeMetadata['contentType'] = 'application/octet-stream'
        storeMetadata['contentHash'] = calcAssetDataHash(data)
        return new DataAsset(storeMetadata, did, data)
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
        storeMetadata['contentHash'] = calcAssetDataHash(data)
        return new DataAsset(storeMetadata, did, data)
    }

    constructor(metadata: string | IMetadata, did?: string, data?: Buffer) {
        let metadataText = metadata
        if (typeof metadata != 'string') {
            metadataText = JSON.stringify(metadata)
        }
        super(<string>metadataText, did)
        this.data = data
    }

    public async saveToFile(filename: string): Promise<void> {
        fs.writeFile(filename, this.data)
    }
}
