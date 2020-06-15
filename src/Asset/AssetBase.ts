/*
 *
 *
 *      Asset Base Class
 *
 *
 */

import { IMetadata } from '../Interfaces/Metadata'
import { decodeToAssetId } from '../Utils'

export class AssetBase {
    public metadataText: string
    public metadata: IMetadata
    public did: string

    constructor(metadata: string | IMetadata, did?: string) {
        if (typeof metadata == 'string') {
            this.metadataText = metadata
            this.metadata = JSON.parse(metadata)
        } else {
            this.metadata = metadata
            this.metadataTex = JSON.stringify(metadata)
        }
        this.did = did
    }

    public getAssetId(): string {
        return decodeToAssetId(this.did)
    }
}
