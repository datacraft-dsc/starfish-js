/*
 *
 *
 *      Asset Base Class
 *
 *
 */

import { IMetaData } from './IMetaData'
import { IAsset } from './IAsset'

import { extractAssetId } from '../Utils'
import { calculateAssetId } from '../Crypto'

export class AssetBase implements IAsset {
    readonly metadataText: string
    readonly metadata: IMetaData
    public did: string

    /**
     * Generate a valid metadata object based on the name and type of asset.
     * @Param name Name of the asset.
     * @param type Type of the asset, see [DEP #8](https://github.com/DEX-Company/DEPs/tree/master/8) to the allowed types
     * @param metadata A pre filled in metadata as a JSON string or object.
     * @returns A new metadata object or the metadata argument value that was provided
     * with the `name` and `type` set.
     */
    public static generateMetadata(name: string, type: string, metaData?: string | IMetaData): IMetaData {
        let newMetaData = {}
        if (metaData) {
            if (typeof metaData === 'string') {
                newMetaData = JSON.parse(metaData)
            }
            newMetaData = metaData
        }
        newMetaData['name'] = name
        newMetaData['type'] = type
        return newMetaData
    }

    public static createEmpty(metaDataText: string, did?: string): AssetBase {
        return new AssetBase(metaDataText, did)
    }


    /**
     * Consruct an asset using it's metadata in string form, and optional asset DID.
     * @param metadataText The asset metadata in text form. The reason for this is that the assetId is created using
     * the hash of the metadata text. This text should provide the same assetId as the one given.
     * @param did AssetDID of this asset.
     */
    constructor(metaDataText: string, did?: string) {
        this.metadataText = metaDataText
        this.metadata = JSON.parse(metaDataText)
        this.did = did
    }

    /**
     * Get the assetId from the internal assetDID.
     */
    public getAssetId(): string {
        return extractAssetId(this.did)
    }

    /**
     * Calculate the assetId based on the metadata text.
     */
    public calculateAssetId(): string {
        return calculateAssetId(this.metadataText)
    }

    /**
     * Compares two assets and see if they are equal.
     * This methods just compares the two calculated asset id's.
     */
    public equals(asset: AssetBase): boolean {
        return this.calculateAssetId() == asset.calculateAssetId()
    }

}
