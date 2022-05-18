/*
 *
 *
 *      Data Asset Class
 *
 *
 */

import { IMetaData, IMetaDataBundle, IBundleMap, IBundleContent } from './IMetaData'
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
        metaData?: string | IMetaDataBundle,
        did?: string
    ): BundleAsset {
        const storeMetaData = AssetBase.generateMetadata(name, 'bundle', metaData)
        storeMetaData.contents = <IBundleMap>{}
        if (assetList && 'forEach' in assetList) {
            if (assetList) {
                const assetMap = <Map<string, string>>assetList
                assetMap.forEach((assetId: string, name: string) => {
                    storeMetaData.contents[name] = <IBundleContent>{ assetID: assetId }
                })
            }
        } else {
            storeMetaData.contents = <IBundleMap>assetList
        }
        return new BundleAsset(storeMetaData, did, storeMetaData.contents)
    }

    /**
     * Construct a new BundleAsset. Please use {@link create} method instead to create a new BundleAsset object.
     * @param metadata Metadata of the asset as string or as an object.
     * @param did DID of the asset.
     * @param assetList Bundle asset list of the assets assigned to this bundle.
     */
    constructor(metaData: string | IMetaData, did?: string, assetList?: IBundleMap) {
        let metaDataText = metaData
        if (typeof metaData != 'string') {
            metaDataText = JSON.stringify(metaData)
        }
        super(<string>metaDataText, did)

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
