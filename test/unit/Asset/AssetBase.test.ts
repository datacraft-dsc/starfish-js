/*

    Test AssetBase

*/

import { assert } from 'chai'

import { AssetBase } from 'starfish/Asset/AssetBase'

describe('AssetBase Class', () => {
    describe('AssetBase constructor', () => {
        it('should create a new AssetBase object', async () => {
            const metadata = {
                name: 'dataset'
            }
            const asset = new AssetBase(JSON.stringify(metadata))
            assert(asset)
            assert(asset.metadata)
            assert(asset.metadataText)
        })
    })
    describe('generateMetadata', () => {
        it('should create a new metadata object', async () => {
            const name = 'testmetadata'
            const metadataType = 'dataset'
            const metadata = AssetBase.generateMetadata(name, metadataType)
            assert(metadata)
            assert.equal(metadata['name'], name)
            assert.equal(metadata['type'], metadataType)
        })
    })

})
