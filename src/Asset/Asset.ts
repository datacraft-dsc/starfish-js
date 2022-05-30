/*
 *
 *      Asset
 *
 *
 */

import { AssetBase } from './AssetBase'
import { DataAsset } from './DataAsset'
import { BundleAsset } from './BundleAsset'
import { OperationAsset } from './OperationAsset'

export { AssetBase, DataAsset, OperationAsset }

export function createAsset(metaDataText: string, did?: string): AssetBase {
    const metadata = JSON.parse(metaDataText)
    if (metadata['type'] == 'dataset') {
        return DataAsset.createEmpty(metaDataText, did)
    } else if (metadata['type'] == 'bundle') {
        return BundleAsset.createEmpty(metaDataText, did)
    } else if (metadata['type'] == 'operation') {
        return OperationAsset.createEmpty(metaDataText, did)
    }
    return AssetBase.createEmpty(metaDataText, did)
}
