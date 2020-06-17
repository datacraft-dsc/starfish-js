/*
 *
 *
 *      Operation Asset Class
 *
 *
 */

import { IMetadataOperation } from 'starfish/Interfaces/IMetadata'
import { AssetBase } from './AssetBase'

export class OperationAsset extends AssetBase {
    public static create(name: string, metadata?: string | IMetadataOperation, did?: string): OperationAsset {
        const storeMetadata = AssetBase.generateMetadata(name, 'operation', metadata)
        return new OperationAsset(JSON.stringify(storeMetadata), did)
    }
}
