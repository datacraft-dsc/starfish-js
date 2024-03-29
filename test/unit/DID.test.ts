/*

    Test Utils

*/

import { assert, expect } from 'chai'
import { randomBytes } from 'crypto'

import {
    didCreate,
    didParse,
    didRandom,
    didToId,
    didValidate,
    didToAssetId,
    idToDID,
    isAssetId,
    isAssetDID,
    prefix0x,
    remove0xPrefix,
} from 'starfish'


describe('DID Test', () => {

    describe('DID Helpers', () => {
        it('should validate a good did', async () => {
            const testDID = didRandom()
            assert(didValidate(testDID))
        })
        it('should throw an invalid header', async () => {
            expect(function() {
                didValidate('xx:dead:1234')
            }).to.throw(/must start with/)
        })
        it('should throw an invalid header', async () => {
            expect(function() {
                didValidate('did:bad-method:1234')
            }).to.throw(/method name must have only/)
        })
        it('should throw an invalid header', async () => {
            expect(function() {
                didValidate('did:method:1234')
            }).to.throw(/path should only have 64 HEX characters/)
        })
        it('should remove leading 0x char from a hex string', async () => {
            assert.equal(remove0xPrefix('0xabcdef1234'), 'abcdef1234')
            assert.equal(remove0xPrefix('0Xabcdef1234'), 'abcdef1234')
            assert.equal(remove0xPrefix('0x'), '')
            assert.equal(remove0xPrefix('01234'), '01234')
            assert.equal(remove0xPrefix('x01234'), 'x01234')
        })
        it('should parse did to get minimum parts', async () => {
            const testId = prefix0x(randomBytes(32).toString('hex'))
            const testDID = didCreate(testId)
            const result = didParse(testDID)
            assert(result)
            assert.equal(result['method'], 'dep')
            assert.equal(result['id'], remove0xPrefix(testId))
            assert.isUndefined(result['path'])
            assert.isUndefined(result['fragment'])
        })
        it('should parse did to get path', async () => {
            const testId = prefix0x(randomBytes(32).toString('hex'))
            const testAssetId = randomBytes(32).toString('hex')
            const testDID = didCreate(testId, testAssetId)
            const result = didParse(testDID)
            assert(result)
            assert.equal(result['method'], 'dep')
            assert.equal(result['id'], remove0xPrefix(testId))
            assert.equal(result['path'], `${remove0xPrefix(testAssetId)}`)
            assert.isUndefined(result['fragment'])
        })
        it('should parse did to get path and fragment', async () => {
            const testId = prefix0x(randomBytes(32).toString('hex'))
            const testAssetId = randomBytes(32).toString('hex')
            const testDID = didCreate(testId, testAssetId, 'fragment')
            const result = didParse(testDID)
            assert(result)
            assert.equal(result['method'], 'dep')
            assert.equal(result['id'], remove0xPrefix(testId))
            assert.equal(result['path'], `${remove0xPrefix(testAssetId)}`)
            assert.equal(result['fragment'], '#fragment')
        })
        it('should validate asset DID', async () => {
            const testAssetId = randomBytes(32).toString('hex')
            const testDID = `${didRandom()}/${testAssetId}`
            assert(isAssetDID(testDID))

            const testBadDID = `${didRandom()}#${testAssetId}`
            assert( !isAssetDID(testBadDID))

            assert( !isAssetDID(didRandom()))


        })
        it('should convert a did to id and id to did', async () => {
            const testId = prefix0x(randomBytes(32).toString('hex'))
            const resultDID = idToDID(testId)
            assert.equal(resultDID, `did:dep:${remove0xPrefix(testId)}`)
            const resultId = didToId(resultDID)
            assert.equal(testId, resultId)
        })
        it('should extract an asset id string to from a DID', async () => {
            const testAssetId = remove0xPrefix(randomBytes(32).toString('hex'))
            const testDID = didCreate(null, testAssetId)
            assert.equal(testAssetId, didToAssetId(testDID))
            assert.equal(testAssetId, didToAssetId(testAssetId))
        })
        it ('should validate an asset id string with no leading 0x', async () => {
            const testAssetId = randomBytes(32).toString('hex')
            assert(isAssetId(testAssetId))
        })
        it ('should validate an asset id string with leading 0x', async () => {
            const testAssetId = prefix0x(randomBytes(32).toString('hex'))
            assert(isAssetId(testAssetId))
        })
        it ('should not validate a non asset id string ', async () => {
            const testAssetId = 'random test'
            assert(!isAssetId(testAssetId))
        })

    })
})
