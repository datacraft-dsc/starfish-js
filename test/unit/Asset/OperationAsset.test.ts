/*

    Test OperationAsset

*/

import { assert } from 'chai'

import { OperationAsset } from 'starfish/Asset/OperationAsset'

describe('OperationAsset Class', () => {
    describe('create', () => {
        it('should create a new OperationAsset object', async () => {
            const name = 'newOperationAsset'
            const asset = OperationAsset.create(name)
            assert(asset)
            assert(asset.metadata)
            assert(asset.metadataText)
            assert.equal(asset.metadata['name'], name)
            assert.equal(asset.metadata['type'], 'operation')
        })
    })
})
