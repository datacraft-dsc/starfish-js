import assert from 'assert'

import Account from '../src/Account'
import Web3 from 'web3'


describe('Account Class', () => {
    describe('Creation', () => {
        it('should create a new empty Account object', async () => {
            let account = new Account()
            assert(account)
        })
        it('should create a new Account object using a password', async () => {
            let web3 = new Web3()
            let password = web3.utils.randomHex(16)
            let account = Account.createNew(password)
            assert(account)
            assert.equal(account.getPassword(), password)
            assert(account.getAddress())
            assert(account.getKeyData())
            assert.equal(account.getKeyFilename(), null)
        })

    })
})
