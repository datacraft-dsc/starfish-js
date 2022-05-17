/*
 *
 *
 *      Operation Asset Class
 *
 *
 */

import { IMetadataOperation } from './IMetadata'
import { AssetBase } from './AssetBase'

export class OperationAsset extends AssetBase {
    /**
     * Create a new Opreation asset.
     * @param name Name of the asset.
     * @param metdata Extra metdata to assign to this asset.
     * @param did DID of the asset.
     * @category Static Create
     */
    public static create(name: string, metadata?: string | IMetadataOperation, did?: string): OperationAsset {
        const storeMetadata = AssetBase.generateMetadata(name, 'operation', metadata)
        return new OperationAsset(JSON.stringify(storeMetadata), did)
    }
}
