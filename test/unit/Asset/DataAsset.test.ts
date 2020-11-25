/*

    Test DataAsset

*/

import { assert } from 'chai'
import fs from 'fs-extra'

import { randomHex, hexToBytes } from 'web3-utils'
import { DataAsset } from 'starfish'

describe('DataAsset Class', () => {
    describe('create', () => {
        it('should create a new DataAsset object', async () => {
            const data = Buffer.from(hexToBytes(randomHex(1024)))
            const name = 'newDataAsset'
            const asset = DataAsset.create(name, data)
            assert(asset)
            assert(asset.metadata)
            assert(asset.metadataText)
            assert.equal(asset.metadata['name'], name)
            assert.equal(asset.metadata['type'], 'dataset')
            assert(asset.data.equals(data))
        })
    })
    describe('createFromFile', () => {
        const filename = '/tmp/testAssetDataFile.dat'
        let data
        before( () => {
            data = Buffer.from(hexToBytes(randomHex(1024)))
            fs.writeFile(filename, data)
        })
        it('should create a new DataAsset object from a file', async () => {
            const name = 'newDataAsset'
            const asset = await DataAsset.createFromFile(name, filename)
            assert(asset)
            assert(asset.metadata)
            assert(asset.metadataText)
            assert.equal(asset.metadata['name'], name)
            assert.equal(asset.metadata['type'], 'dataset')
            assert(asset.data.equals(data))
            assert.equal(asset.metadata['contentType'], 'application/octet-stream')
        })
        after( () => {
            fs.remove(filename)
        })
    })
    describe('saveToFile', () => {
        const filename = '/tmp/testAssetDataFile.dat'
        it('should save the data to a file', async () => {
            const data = Buffer.from(hexToBytes(randomHex(1024)))
            const name = 'newDataAsset'
            const asset = DataAsset.create(name, data)
            await asset.saveToFile(filename)
            assert(fs.exists(filename))
        })
        after( () => {
            fs.remove(filename)
        })
    })
})
