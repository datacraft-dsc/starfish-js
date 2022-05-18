/*

    Test AssetBase

*/

import { assert } from 'chai'

import { AssetBase, didRandom, calculateAssetId } from 'starfish'

describe('AssetBase Class', () => {
    describe('AssetBase constructor', () => {
        it('should create a new AssetBase object', async () => {
            const metaData = {
                name: 'dataset'
            }
            const asset = new AssetBase(JSON.stringify(metaData))
            assert(asset)
            assert(asset.metadata)
            assert(asset.metadataText)
        })
    })
    describe('generateMetadata', () => {
        it('should create a new metaData object', async () => {
            const name = 'testmetadata'
            const metaDataType = 'dataset'
            const metaData = AssetBase.generateMetadata(name, metaDataType)
            assert(metaData)
            assert.equal(metaData['name'], name)
            assert.equal(metaData['type'], metaDataType)
        })
    })

    describe('AssetBase Methods', () => {
        let metaData
        let metaDataText
        let assetId
        let assetDID
        let asset
        before( () => {
            metaData = {
                name: 'testAsset',
                type: 'dataset',
                description: 'This is the metaData disciption',
            }
            metaDataText = JSON.stringify(metaData)
            assetId =calculateAssetId(metaDataText)
            assetDID = `${didRandom()}${assetId}`
            asset = new AssetBase(metaDataText, assetDID)

        })
        describe('getAssetid', () => {
            it('should get the asset id from the internal DID', () => {
                assert.equal(asset.getAssetId(), assetId)
            })
        })

        describe('calculateAssetId', () => {
            it('should calculate the correct assetId', () => {
                assert.equal(asset.calculateAssetId(), assetId)
            })
        })
        describe('equals', () => {
            it('should both asset be equal', () => {
                const newAsset = new AssetBase(metaDataText, assetDID)
                assert(asset.equals(newAsset))
            })
            it('should not equal to an asset with different metaData', () => {
                const newMetaData = metaData
                newMetaData['name'] = 'new metaData'
                const newMetaDataText = JSON.stringify(newMetaData)
                const newAsset = new AssetBase(newMetaDataText, assetDID)
                assert.isNotOk(asset.equals(newAsset))
            })
        })

    })
})
