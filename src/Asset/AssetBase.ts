/*
 *
 *
 *      Asset Base Class
 *
 *
 */

import { IMetadata } from 'starfish/Interfaces/Metadata'
import { IAsset } from 'starfish/Interfaces/IAsset'

import { decodeToAssetId } from 'starfish/Utils'

export class AssetBase implements IAsset {
    readonly metadataText: string
    public metadata: IMetadata
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
        return decodeToAssetId(this.did)
    }
}
