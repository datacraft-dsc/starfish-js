/*

    Test DataAsset

*/

import { assert } from 'chai'

import { randomHex, hexToBytes } from 'web3-utils'

import { DataAsset } from 'starfish/Asset/DataAsset'

describe('DataAsset Class', () => {
    describe('DataAsset constructor', () => {
        it('should create a new DataAsset object', async () => {
            const data = Buffer.from(hexToBytes(randomHex(1024)))
            const name = 'newDataAsset'
            const asset = DataAsset.create(name, data)
            assert(asset)
            assert(asset.metadata)
            assert(asset.metadataText)
            assert.equal(asset.metadata['name'], name)
            assert.equal(asset.metadata['type'], 'dataset')
        })
    })
})
