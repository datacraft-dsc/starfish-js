/*

    Test Crypto

*/

import { assert } from 'chai'

import { sha3_256 } from 'js-sha3'

import {
    calculateAssetId,
    calculateAssetDataHash,
    randomBytes
} from 'starfish'


describe('Crypto', () => {
    describe('Generate random bytes', () => {
        it('should generate random values', () => {
            const data = randomBytes(64)
            assert.equal(data.length, 64)
            const newData = randomBytes(64)
            assert.notEqual(data, newData)
        })
    })
    describe('calculate asset id', () => {
        it('should be the same as crypto sha3-256', () => {
            const data = 'the same test message to hash'
            const assetId = calculateAssetId(data)
            const cryptoHash = sha3_256(data)
            assert.equal(assetId, cryptoHash)
        })
    })
    describe('calculate data hash', () => {
        it('should return the correct data hash as crypto', () => {
            const data = randomBytes(32)
            const dataHash = calculateAssetDataHash(data)
            const cryptoHash = sha3_256(data)
            assert.equal(cryptoHash, dataHash)
        })
    })
})
