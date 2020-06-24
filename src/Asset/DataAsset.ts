/*
 *
 *
 *      Data Asset Class
 *
 *
 */

import fs from 'fs-extra'
import mime from 'mime-types'

import { IMetadata, IMetadataData } from '../Interfaces/IMetadata'
import { AssetBase } from './AssetBase'
import { calcAssetDataHash } from '../Crypto'

export class DataAsset extends AssetBase {
    public data: Buffer

    /**
     * Create a DataAsset.
     * @param name Name of the asset to create
     * @param data Data buffer to use for the data.
     * @param metadata Extra metadata to add to the asset metadata.
     * @param did DID of the asset.
     * @returns a new DataAseet object.
     * @category Static Create
     */
    public static create(name: string, data: Buffer, metadata?: string | IMetadataData, did?: string): DataAsset {
        const storeMetadata = AssetBase.generateMetadata(name, 'dataset', metadata)
        storeMetadata.contentType = 'application/octet-stream'
        storeMetadata.contentHash = calcAssetDataHash(data)
        return new DataAsset(storeMetadata, did, data)
    }

    /**
     * Create a new data asset object from a file.
     * @param name Name of the asset
     * @param filename Filename of the file to read.
     * @param metadata Extra metadata to use to create the asset.
     * @prama did DID of the asset.
     * @returns a DataAsset object with the data and contentType obtained from the file.
     * @category Static Create
     */
    public static async createFromFile(
        name: string,
        filename: string,
        metadata?: string | IMetadataData,
        did?: string
    ): Promise<DataAsset> {
        const storeMetadata = AssetBase.generateMetadata(name, 'dataset', metadata)
        const data = await fs.readFile(filename)
        storeMetadata.contentType = 'application/octet-stream'
        const mimeType = mime.lookup(filename)
        if (mimeType) {
            storeMetadata.contentType = mimeType
        }
        storeMetadata.contentHash = calcAssetDataHash(data)
        return new DataAsset(storeMetadata, did, data)
    }

    /**
     * Contstruct a DataAsset.
     */
    constructor(metadata: string | IMetadata, did?: string, data?: Buffer) {
        let metadataText = metadata
        if (typeof metadata != 'string') {
            metadataText = JSON.stringify(metadata)
        }
        super(<string>metadataText, did)
        this.data = data
    }

    /**
     * Save the asset data to a file.
     * @param filename Name of file to save too.
     * @returns True if successful, else False.
     */
    public async saveToFile(filename: string): Promise<void> {
        fs.writeFile(filename, this.data)
    }
}
