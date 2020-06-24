/*
 *
 *
 *      Data Asset Class
 *
 *
 */

import { IMetadata, IMetadataBundle, IBundleMap, IBundleContent } from '../Interfaces/IMetadata'
import { AssetBase } from './AssetBase'

export class BundleAsset extends AssetBase {
    public assetList: IBundleMap

    /**
     * Create a new Bundle asset object.
     * @param name Name of the asset.
     * @param assetList List of assetId's. This can be a IBundleMap object, or a Map with name->assetId.
     * @param metadata Metadata to provide with the asset.
     * @param did Asset DID to assign to the asset.
     * @category Static Create
     */
    public static create(
        name: string,
        assetList?: IBundleMap | Map<string, string>,
        metadata?: string | IMetadataBundle,
        did?: string
    ): BundleAsset {
        const storeMetadata = AssetBase.generateMetadata(name, 'bundle', metadata)
        storeMetadata.contents = <IBundleMap>{}
        if (assetList && 'forEach' in assetList) {
            if (assetList) {
                const assetMap = <Map<string, string>>assetList
                assetMap.forEach((assetId: string, name: string) => {
                    storeMetadata.contents[name] = <IBundleContent>{ assetID: assetId }
                })
            }
        } else {
            storeMetadata.contents = <IBundleMap>assetList
        }
        return new BundleAsset(storeMetadata, did, storeMetadata.contents)
    }

    /**
     * Construct a new BundleAsset. Please use {@link create} method instead to create a new BundleAsset object.
     * @param metadata Metadata of the asset as string or as an object.
     * @param did DID of the asset.
     * @param assetList Bundle asset list of the assets assigned to this bundle.
     */
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
        this.assetList[name] = <IBundleContent>{ assetID: assetId }
    }
    public getAsset(name: string): string {
        return this.assetList[name].assetID
    }
    public deleteAsset(name: string): void {
        delete this.assetList[name]
    }
}
