/*
 *
 *
 *      Data Asset Class
 *
 *
 */

import { IMetadata, IMetadataData } from 'starfish/Interfaces/IMetadata'
import { AssetBase } from './AssetBase'

export class BundleAsset extends AssetBase {
    public assetList: Map<string, AssetBase>

    public static create(
        name: string,
        assetList: Map<string, AssetBase>,
        metadata?: string | IMetadataData,
        did?: string
    ): BundleAsset {
        const storeMetadata = AssetBase.generateMetadata(name, 'bundle', metadata)
        return new BundleAsset(storeMetadata, did, assetList)
    }

    constructor(metadata: string | IMetadata, did?: string, assetList?: Map<string, AssetBase>) {
        let metadataText = metadata
        if (typeof metadata != 'string') {
            metadataText = JSON.stringify(metadata)
        }
        super(<string>metadataText, did)

        if (assetList) {
            this.assetList = assetList
        } else {
            this.assetList = new Map<string, AssetBase>()
        }
    }

    public setAsset(name: string, asset: AssetBase): void {
        this.assetList.set(name, asset)
    }
    public getAsset(name: string): AssetBase {
        return this.assetList.get(name)
    }
    public deleteAsset(name: string): void {
        this.assetList.delete(name)
    }
}
