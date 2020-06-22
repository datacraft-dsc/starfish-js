/*
 *
 *
 *      Asset Base Class
 *
 *
 */

import { IMetadata } from '../Interfaces/IMetadata'
import { IAsset } from '../Interfaces/IAsset'

import { extractAssetId } from '../Utils'
import { calcAssetId } from '../Crypto'

export class AssetBase implements IAsset {
    readonly metadataText: string
    readonly metadata: IMetadata
    public did: string

    public static generateMetadata(name: string, type: string, metadata?: string | IMetadata): IMetadata {
        let newMetadata = {}
        if (metadata) {
            if (typeof metadata === 'string') {
                newMetadata = JSON.parse(metadata)
            }
            newMetadata = metadata
        }
        newMetadata['name'] = name
        newMetadata['type'] = type
        return newMetadata
    }

    constructor(metadataText: string, did?: string) {
        this.metadataText = metadataText
        this.metadata = JSON.parse(metadataText)
        this.did = did
    }

    public getAssetId(): string {
        return extractAssetId(this.did)
    }
    public calcAssetId(): string {
        return calcAssetId(this.metadataText)
    }
    public equals(asset: AssetBase): boolean {
        return this.calcAssetId() == asset.calcAssetId()
    }
}
