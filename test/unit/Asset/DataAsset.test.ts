/*

    Test DataAsset

*/

import { assert } from 'chai'
import fs from 'fs-extra'

import { randomBytes } from 'crypto'
import { DataAsset } from 'starfish'

import temporaryDirectory from 'temp-dir'
import path from 'node:path'

describe('DataAsset Class', () => {
    describe('create', () => {
        it('should create a new DataAsset object', async () => {
            const data = Buffer.from(randomBytes(1024))
            const name = 'newDataAsset'
            const asset = DataAsset.create(name, data)
            assert(asset)
            assert(asset.metadata)
            assert(asset.metadataText)
            assert.equal(asset.metadata['name'], name)
            assert.equal(asset.metadata['type'], 'dataset')
            assert(Buffer.from(asset.data).equals(data))
        })
    })
    describe('createFromFile', () => {
        const filename = path.join(temporaryDirectory, 'testAssetDataFile.dat')
        let data
        before( () => {
            data = Buffer.from(randomBytes(1024))
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
            assert(Buffer.from(asset.data).equals(data))
            assert.equal(asset.metadata['contentType'], 'application/octet-stream')
        })
        after( () => {
            fs.remove(filename)
        })
    })
    describe('saveToFile', () => {
        const filename = path.join(temporaryDirectory, 'testAssetDataFile.dat')
        it('should save the data to a file', async () => {
            const data = Buffer.from(randomBytes(1024))
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
