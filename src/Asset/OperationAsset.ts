/*
 *
 *
 *      Operation Asset Class
 *
 *
 */

import { IMetaDataOperation } from './IMetaData'
import { AssetBase } from './AssetBase'

export class OperationAsset extends AssetBase {
    /**
     * Create a new Opreation asset.
     * @param name Name of the asset.
     * @param metdata Extra metdata to assign to this asset.
     * @param did DID of the asset.
     * @category Static Create
     */
    public static create(name: string, metaData?: string | IMetaDataOperation, did?: string): OperationAsset {
        const storeMetaData = AssetBase.generateMetadata(name, 'operation', metaData)
        return new OperationAsset(JSON.stringify(storeMetaData), did)
    }
    public static createEmpty(metaDataText: string, did?: string): OperationAsset {
        return new OperationAsset(metaDataText, did)
    }
}
