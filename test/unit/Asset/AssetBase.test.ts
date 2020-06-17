/*

    Test AssetBase

*/

import { assert } from 'chai'

import { AssetBase } from 'starfish/Asset/AssetBase'
import { didRandom } from 'starfish/Utils'
import { calcAssetId } from 'starfish/Crypto'

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

    describe('AssetBase Methods', () => {
        let metadata
        let metadataText
        let assetId
        let assetDID
        let asset
        before( () => {
            metadata = {
                name: 'testAsset',
                type: 'dataset',
                description: 'This is the metadata disciption',
            }
            metadataText = JSON.stringify(metadata)
            assetId =calcAssetId(metadataText)
            assetDID = `${didRandom()}${assetId}`
            asset = new AssetBase(metadataText, assetDID)

        })
        describe('getAssetid', () => {
            it('should get the asset id from the internal DID', () => {
                assert.equal(asset.getAssetId(), assetId)
            })
        })

        describe('calcAssetId', () => {
            it('should calculate the correct assetId', () => {
                assert.equal(asset.calcAssetId(), assetId)
            })
        })
        describe('equals', () => {
            it('should both asset be equal', () => {
                const newAsset = new AssetBase(metadataText, assetDID)
                assert(asset.equals(newAsset))
            })
            it('should not equal to an asset with different metadata', () => {
                const newMetadata = metadata
                newMetadata['name'] = 'new metadata'
                const newMetadataText = JSON.stringify(newMetadata)
                const newAsset = new AssetBase(newMetadataText, assetDID)
                assert.isNotOk(asset.equals(newAsset))
            })
        })

    })
})
