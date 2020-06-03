/*

    Test Helpers

*/
// import assert from 'assert'
import {assert, expect} from 'chai'

import { didGenerateRandom, didValidate, removeLeadingHexZero } from '../src/Helpers'


describe('DID Helper', () => {
    it('should validate a good did', async () => {
        const testDID = didGenerateRandom()
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
        assert.equal(removeLeadingHexZero('0xabcdef1234'), 'abcdef1234')
        assert.equal(removeLeadingHexZero('0Xabcdef1234'), 'abcdef1234')
        assert.equal(removeLeadingHexZero('0x'), '')
        assert.equal(removeLeadingHexZero('01234'), '01234')
        assert.equal(removeLeadingHexZero('x01234'), 'x01234')
    })

})
