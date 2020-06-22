/*
 *
 *
 *      Data Asset Class
 *
 *
 */

import { IMetadata, IMetadataBundle, IBundleMap } from 'starfish/Interfaces/IMetadata'
import { AssetBase } from './AssetBase'

export class BundleAsset extends AssetBase {
    public assetList: IBundleMap

    public static create(name: string, assetList: IBundleMap, metadata?: string | IMetadataBundle, did?: string): BundleAsset {
        const storeMetadata = AssetBase.generateMetadata(name, 'bundle', metadata)
        storeMetadata.contents = assetList
        return new BundleAsset(storeMetadata, did, assetList)
    }

    constructor(metadata: string | IMetadata, did?: string, assetList?: IBundleMap) {
        let metadataText = metadata
        if (typeof metadata != 'string') {
            metadataText = JSON.stringify(metadata)
        }
        super(<string>metadataText, did)

        if (assetList) {
            this.assetList = assetList
        } else {
            this.assetList = {}
        }
    }

    public setAsset(name: string, assetId: string): void {
        this.assetList[name] = assetId
    }
    public getAsset(name: string): string {
        return this.assetList[name]
    }
    public deleteAsset(name: string): void {
        delete this.assetList[name]
    }
}
