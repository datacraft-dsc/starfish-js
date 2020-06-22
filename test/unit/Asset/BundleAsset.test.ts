/*

    Test BundleAsset

*/

import { assert } from 'chai'
import { randomHex } from 'web3-utils'

import { BundleAsset } from 'starfish/Asset/BundleAsset'
import { IBundleMap, IBundleContent } from 'starfish/Interfaces/IMetadata'

describe('BundleAsset Class', () => {
    describe('create', () => {
        it('should create a new BundleAsset object', async () => {
            const name = 'newBundleAsset'
            const asset = BundleAsset.create(name)
            assert(asset)
            assert(asset.metadata)
            assert(asset.metadataText)
            assert.equal(asset.metadata['name'], name)
            assert.equal(asset.metadata['type'], 'bundle')
        })
        it('should create a new BundleAsset object with a map list of asset ids', async () => {
            const name = 'newBundleAsset'
            let assetList: Map<string, string> = new Map<string, string>()
            for ( let index = 0; index < 20; index ++ ) {
                assetList.set(`testAsset_${index}`, randomHex(32))
            }
            const asset = BundleAsset.create(name, assetList)
            assert(asset)
            assert(asset.metadata)
            assert(asset.metadataText)
            assert.equal(asset.metadata['name'], name)
            assert.equal(asset.metadata['type'], 'bundle')
            assert(asset.metadata.contents.testAsset_10.assetID)
        })
        it('should create a new BundleAsset object with a IBundleMap', async () => {
            const name = 'newBundleAsset'
            let assetList: IBundleMap = {}
            for ( let index = 0; index < 20; index ++ ) {
                assetList[`testAsset_${index}`] = <IBundleContent>{ assetID: randomHex(32) }
            }
            const asset = BundleAsset.create(name, assetList)
            assert(asset)
            assert(asset.metadata)
            assert(asset.metadataText)
            assert.equal(asset.metadata['name'], name)
            assert.equal(asset.metadata['type'], 'bundle')
            assert(asset.metadata.contents.testAsset_10.assetID)
        })

    })
})
