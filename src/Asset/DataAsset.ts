/*
 *
 *
 *      Data Asset Class
 *
 *
 */

import mime from 'mime-types'
import { parse as csvParse } from 'csv-parse/sync'

import { IMetaData, IMetaDataData } from './IMetaData'
import { AssetBase } from './AssetBase'
import { calculateAssetDataHash } from '../Crypto'
import { arrayBufferToString } from '../Utils'

export class DataAsset extends AssetBase {
    public data: ArrayBuffer

    /**
     * Create a DataAsset.
     * @param name Name of the asset to create
     * @param data Data buffer to use for the data.
     * @param metadata Extra metadata to add to the asset metadata.
     * @param did DID of the asset.
     * @returns a new DataAseet object.
     * @category Static Create
     */
    public static create(name: string, data: ArrayBuffer, metaData?: string | IMetaDataData, did?: string): DataAsset {
        const storeMetaData = AssetBase.generateMetadata(name, 'dataset', metaData)
        if (storeMetaData.contentType === undefined) {
            storeMetaData.contentType = 'application/octet-stream'
        }
        if (storeMetaData.contentHash === undefined) {
            storeMetaData.contentHash = calculateAssetDataHash(data)
        }
        return new DataAsset(storeMetaData, did, data)
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
        metaData?: string | IMetaDataData,
        did?: string
    ): Promise<DataAsset> {
        const fs = await import('fs')
        const storeMetaData = AssetBase.generateMetadata(name, 'dataset', metaData)
        const data = await fs.promises.readFile(filename)
        storeMetaData.contentType = 'application/octet-stream'
        const mimeType = mime.lookup(filename)
        if (mimeType) {
            storeMetaData.contentType = mimeType
        }
        storeMetaData.contentHash = calculateAssetDataHash(data)
        return new DataAsset(storeMetaData, did, data)
    }

    public static createEmpty(metaDataText: string, did?: string): DataAsset {
        return new DataAsset(metaDataText, did)
    }

    /**
     * Contstruct a DataAsset.
     */
    constructor(metaData: string | IMetaData, did?: string, data?: ArrayBuffer) {
        let metaDataText = metaData
        if (typeof metaData != 'string') {
            metaDataText = JSON.stringify(metaData)
        }
        super(<string>metaDataText, did)
        this.data = data
    }

    /**
     * Save the asset data to a file.
     * @param filename Name of file to save too.
     * @returns True if successful, else False.
     */
    public async saveToFile(filename: string): Promise<void> {
        const fs = await import('fs')
        fs.promises.writeFile(filename, Buffer.from(this.data))
    }

    public json(): string {
        return JSON.parse(this.text())
    }

    public text(): string {
        return arrayBufferToString(this.data)
    }

    public csv(options: any): any {
        return csvParse(this.text(), options)
    }
}
